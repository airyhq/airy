package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.facebook.model.Conversation;
import co.airy.core.sources.facebook.model.SendMessageRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Suppressed;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import static co.airy.avro.communication.MetadataRepository.getSubject;
import static co.airy.avro.communication.MetadataRepository.isConversationMetadata;

public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "sources.facebook.ConnectorStores";

    private final KafkaStreamsWrapper streams;
    private final String channelsStore = "channels-store";
    private final String allChannelsKey = "ALL";
    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final Connector connector;

    public Stores(KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecordBase> producer, Connector connector) {
        this.streams = streams;
        this.producer = producer;
        this.connector = connector;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();
        builder.<String, Channel>stream(applicationCommunicationChannels)
                .groupBy((k, v) -> allChannelsKey)
                .aggregate(HashMap::new, (allKey, channel, channelsMap) -> {
                    // An external channel id may only be connected once
                    channelsMap.put(channel.getId(), channel);
                    return channelsMap;
                }, Materialized.as(channelsStore));

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>table(applicationCommunicationChannels)
                .filter((sourceChannelId, channel) -> "facebook".equalsIgnoreCase(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        // Facebook messaging stream by conversation-id
        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> "facebook".equalsIgnoreCase(message.getSource()))
                .selectKey((messageId, message) -> message.getConversationId());

        // Metadata table
        final KTable<String, Map<String, String>> metadataTable = builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .filter((metadataId, metadata) -> isConversationMetadata(metadata))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(HashMap::new, (conversationId, metadata, aggregate) -> {
                    aggregate.put(metadata.getKey(), metadata.getValue());
                    return aggregate;
                }, (conversationId, metadata, aggregate) -> {
                    aggregate.remove(metadata.getKey());
                    return aggregate;
                });

        // Conversation table
        final KTable<String, Conversation> conversationTable = messageStream
                .groupByKey()
                .aggregate(Conversation::new,
                        (conversationId, message, aggregate) -> {
                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }

                            aggregate.setChannelId(message.getChannelId());

                            return aggregate;
                        })
                .join(channelsTable, Conversation::getChannelId, (aggregate, channel) -> {
                    aggregate.setChannel(channel);
                    return aggregate;
                });

        // Send outbound messages
        messageStream.filter((messageId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(conversationTable, (message, conversation) -> new SendMessageRequest(conversation, message))
                .mapValues(connector::sendMessage)
                .to(new ApplicationCommunicationMessages().name());

        // Fetch missing metadata
        conversationTable
                // To avoid any redundant fetch contact operations the suppression interval should
                // be higher than the timeout of the Facebook API
                .suppress(Suppressed.untilTimeLimit(Duration.ofMillis(streams.getSuppressIntervalInMs()), Suppressed.BufferConfig.unbounded()))
                .toStream()
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    conversation.setMetadata(new HashMap<>(Optional.ofNullable(metadataMap).orElse(Map.of())));
                    return conversation;
                })
                .filter(connector::needsMetadataFetched)
                .flatMap(connector::fetchMetadata)
                .to(new ApplicationCommunicationMetadata().name());

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Map<String, Channel>> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    public Map<String, Channel> getChannelsMap() {
        final ReadOnlyKeyValueStore<String, Map<String, Channel>> channelsStore = getChannelsStore();

        return Optional.ofNullable(channelsStore.get(allChannelsKey)).orElse(Map.of());
    }

    public void storeChannel(Channel channel) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        startStream();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
