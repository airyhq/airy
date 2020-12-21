package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.google.model.SendMessageRequest;
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
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class Stores implements DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final String appId = "sources.google.ConnectorStores";
    private final String allChannelsKey = "ALL";
    private final String channelsStore = "channels-store";
    private static final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

    private final KafkaStreamsWrapper streams;
    private final Connector connector;

    Stores(KafkaStreamsWrapper streams, Connector connector) {
        this.streams = streams;
        this.connector = connector;
    }

    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Channel>stream(applicationCommunicationChannels)
                .groupBy((k, v) -> allChannelsKey)
                .aggregate(HashMap::new, (allKey, channel, channelsMap) -> {
                    // An external channel id may only be connected once
                    channelsMap.put(channel.getId(), channel);
                    return channelsMap;
                }, Materialized.as(channelsStore));

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> "google".equalsIgnoreCase(message.getSource()))
                .selectKey((messageId, message) -> message.getConversationId());

        final KTable<String, SendMessageRequest> contextTable = messageStream
                .groupByKey()
                .aggregate(SendMessageRequest::new,
                        (conversationId, message, aggregate) -> {
                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }
                            return aggregate;
                        });

        messageStream.filter((messageId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(contextTable, (message, sendMessageRequest) -> sendMessageRequest.toBuilder().message(message).build())
                .mapValues(connector::sendMessage)
                .to(new ApplicationCommunicationMessages().name());

        streams.start(builder.build(), appId);
    }

    private ReadOnlyKeyValueStore<String, Map<String, Channel>> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    public Map<String, Channel> getChannels() {
        final ReadOnlyKeyValueStore<String, Map<String, Channel>> channelsStore = getChannelsStore();

        return Optional.ofNullable(channelsStore.get(allChannelsKey)).orElse(Map.of());
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
