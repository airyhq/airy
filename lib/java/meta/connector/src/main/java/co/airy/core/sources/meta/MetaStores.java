package co.airy.core.sources.meta;

import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.meta.dto.Conversation;
import co.airy.core.sources.meta.dto.SendMessageRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isConversationMetadata;

public abstract class MetaStores {

    protected final KafkaStreamsWrapper streams;
    protected final String channelsStore = "channels-store";
    protected final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    protected final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    protected final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    protected final KafkaProducer<String, SpecificRecordBase> producer;
    protected final MetaConnector connector;

    public void startStream(String source) {
        final StreamsBuilder builder = new StreamsBuilder();

        KStream<String, Channel> channelStream = builder.<String, Channel>stream(applicationCommunicationChannels);

        channelStream.toTable(Materialized.as(channelsStore));

        // Channels table
        KTable<String, Channel> channelsTable = channelStream
                .filter((sourceChannelId, channel) -> source.equals(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED)).toTable();

        // Meta messaging stream by conversation-id
        final KStream<String, Message> messageStream = builder.<String, Message>stream(applicationCommunicationMessages)
                .filter((messageId, message) -> message != null && source.equals(message.getSource()))
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

        // Context table
        final KTable<String, Conversation> contextTable = messageStream
                .groupByKey()
                .aggregate(Conversation::new,
                        (conversationId, message, conversation) -> {
                            final Conversation.ConversationBuilder conversationBuilder = conversation.toBuilder();
                            if (message.getIsFromContact()) {
                                conversationBuilder.sourceConversationId(message.getSenderId());
                            }
                            conversationBuilder.channelId(message.getChannelId());

                            return conversationBuilder.build();
                        })
                .join(channelsTable, Conversation::getChannelId, (conversation, channel) -> conversation.toBuilder()
                        .channelId(conversation.getChannelId())
                        .channel(channel)
                        .sourceConversationId(conversation.getSourceConversationId())
                        .build());

        // Send outbound messages
        messageStream.filter((conversationId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(contextTable, (message, conversation) -> new SendMessageRequest(conversation, message))
                .flatMap((conversationId, sendMessageRequest) -> connector.sendMessage(sendMessageRequest))
                .to((recordId, record, context) -> {
                    if (record instanceof Metadata) {
                        return applicationCommunicationMetadata;
                    }
                    if (record instanceof Message) {
                        return applicationCommunicationMessages;
                    }

                    throw new IllegalStateException("Unknown type for record " + record);
                });

        // Fetch missing metadata
        contextTable
                .toStream()
                .leftJoin(metadataTable, (conversation, metadataMap) -> conversation
                        .toBuilder()
                        .metadata(new HashMap<>(Optional.ofNullable(metadataMap).orElse(Map.of())))
                        .build())
                .filter((k, v) -> connector.needsMetadataFetched(v))
                .flatMap(connector::fetchMetadata)
                .to(new ApplicationCommunicationMetadata().name());

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    public void storeChannelContainer(ChannelContainer container) throws ExecutionException, InterruptedException {
        final Channel channel = container.getChannel();
        storeChannel(channel);

        for (Metadata metadata : container.getMetadataMap().values()) {
            producer.send(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), metadata)).get();
        }
    }

    public void storeChannel(Channel channel) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
    }

    public void stopStream() {
        if (streams != null) {
            streams.close();
        }
    }
}
