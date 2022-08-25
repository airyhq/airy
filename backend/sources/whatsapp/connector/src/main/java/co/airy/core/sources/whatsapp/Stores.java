package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.dto.Conversation;
import co.airy.core.sources.whatsapp.dto.SendMessageRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

import static co.airy.model.metadata.MetadataRepository.getId;

@Service
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean, HealthIndicator {
    private static final String appId = "sources.whatsapp.ConnectorStores";

    private final KafkaStreamsWrapper streams;
    private final String channelsStore = "channels-store";
    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final Connector connector;

    public Stores(KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecordBase> producer, Connector connector) {
        this.streams = streams;
        this.producer = producer;
        this.connector = connector;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        KStream<String, Channel> channelStream = builder.<String, Channel>stream(applicationCommunicationChannels);

        channelStream.toTable(Materialized.as(channelsStore));

        // Channels table
        KTable<String, Channel> channelsTable = channelStream
                .filter((sourceChannelId, channel) -> "whatsapp".equals(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED)).toTable();

        // Whatsapp messaging stream by conversation-id
        final KStream<String, Message> messageStream = builder.<String, Message>stream(applicationCommunicationMessages)
                .filter((messageId, message) -> message != null && "whatsapp".equals(message.getSource()))
                .selectKey((messageId, message) -> message.getConversationId());


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

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        getChannelsStore();
        return Health.up().build();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
