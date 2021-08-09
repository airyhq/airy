package co.airy.core.sources.viber;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.viber.dto.SendMessageRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceViberEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutionException;

import static co.airy.model.metadata.MetadataRepository.getId;

@Component
public class Stores implements ApplicationListener<ApplicationReadyEvent>, DisposableBean, HealthIndicator {

    private static final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private static final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private static final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private static final String appId = "sources.viber.ConnectorStores";
    private final String channelsStore = "channels-store";

    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final Connector connector;
    private final EventsRouter eventsRouter;

    Stores(KafkaStreamsWrapper streams, Connector connector, KafkaProducer<String, SpecificRecordBase> producer, EventsRouter eventsRouter) {
        this.streams = streams;
        this.connector = connector;
        this.producer = producer;
        this.eventsRouter = eventsRouter;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        KStream<String, Channel> channelStream = builder.stream(applicationCommunicationChannels);

        // Channels table
        KTable<String, Channel> channelsTable = channelStream
                .filter((sourceChannelId, channel) -> channel.getSource().startsWith("viber")
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED)).toTable(Materialized.as(channelsStore));

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> message != null && message.getSource().startsWith("viber"))
                .selectKey((messageId, message) -> message.getConversationId());

        final KTable<String, SendMessageRequest> contextTable = messageStream
                .groupByKey()
                .aggregate(SendMessageRequest::new,
                        (conversationId, message, aggregate) -> {
                            SendMessageRequest.SendMessageRequestBuilder sendMessageRequestBuilder = aggregate.toBuilder();
                            if (message.getIsFromContact()) {
                                sendMessageRequestBuilder.sourceConversationId(message.getSenderId());
                            }

                            sendMessageRequestBuilder.channelId(message.getChannelId());

                            return sendMessageRequestBuilder.build();
                        })
                .join(channelsTable, SendMessageRequest::getChannelId,
                        (aggregate, channel) -> aggregate.toBuilder().channel(channel).build());

        // TODO
        messageStream.filter((messageId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(contextTable, (message, sendMessageRequest) -> sendMessageRequest.toBuilder().message(message).build())
                .map((conversationId, sendMessageRequest) -> {
                    final Message message = connector.sendMessage(sendMessageRequest);
                    return KeyValue.pair(message.getId(), message);
                })
                .to(applicationCommunicationMessages);

        builder.<String,String>stream(new SourceViberEvents().name())
                .flatMap(eventsRouter::onEvent)
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
