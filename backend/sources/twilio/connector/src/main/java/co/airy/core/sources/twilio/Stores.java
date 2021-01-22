package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.twilio.dto.SendMessageRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.KafkaStreams;
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

@Component
public class Stores implements ApplicationListener<ApplicationReadyEvent>, DisposableBean, HealthIndicator {

    private static final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

    private static final String appId = "sources.twilio.ConnectorStores";
    private final String channelsStore = "channels-store";

    private final KafkaStreamsWrapper streams;
    private final Connector connector;

    Stores(KafkaStreamsWrapper streams, Connector connector) {
        this.streams = streams;
        this.connector = connector;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        KStream<String, Channel> channelStream = builder.stream(applicationCommunicationChannels);

        // Channels table
        KTable<String, Channel> channelsTable = channelStream
                .filter((sourceChannelId, channel) -> channel.getSource().startsWith("twilio")
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED)).toTable();

        channelStream.toTable(Materialized.as(channelsStore));

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> message.getSource().startsWith("twilio"))
                .selectKey((messageId, message) -> message.getConversationId());

        final KTable<String, SendMessageRequest> contextTable = messageStream
                .groupByKey()
                .aggregate(SendMessageRequest::new,
                        (conversationId, message, aggregate) -> {
                            SendMessageRequest.SendMessageRequestBuilder sendMessageRequestBuilder = aggregate.toBuilder();
                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                sendMessageRequestBuilder.sourceConversationId(message.getSenderId());
                            }

                            sendMessageRequestBuilder.channelId(message.getChannelId());

                            return sendMessageRequestBuilder.build();
                        })
                .join(channelsTable, SendMessageRequest::getChannelId,
                        (aggregate, channel) -> aggregate.toBuilder().channel(channel).build());

        messageStream.filter((messageId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(contextTable, (message, sendMessageRequest) -> sendMessageRequest.toBuilder().message(message).build())
                .mapValues(connector::sendMessage)
                .to(new ApplicationCommunicationMessages().name());

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
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
