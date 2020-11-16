package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutionException;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final Logger log = AiryLoggerFactory.getLogger(Stores.class);
    private static final String appId = "sources.ChatPluginStores";

    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final KafkaStreamsWrapper streams;
    private final WebSocketController webSocketController;
    private final KafkaProducer<String, Message> producer;
    private final String channelStore = "channel-store";

    Stores(KafkaStreamsWrapper streams,
           KafkaProducer<String, Message> producer,
           WebSocketController webSocketController) {
        this.streams = streams;
        this.producer = producer;
        this.webSocketController = webSocketController;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final KStream<String, Message> messageStream = builder.<String, Message>stream(applicationCommunicationMessages)
                .filter((messageId, message) -> "chat_plugin".equals(message.getSource()));

        // Client Echoes
        messageStream.filter((messageId, message) -> message.getSenderType().equals(SenderType.SOURCE_CONTACT))
                .peek((messageId, message) -> webSocketController.onNewMessage(message));

        // Runtime Outbound
        messageStream.filter((messageId, message) -> !message.getSenderType().equals(SenderType.SOURCE_CONTACT)
                && message.getDeliveryState().equals(DeliveryState.PENDING)
        )
                .mapValues((messageId, message) -> {
                    message.setDeliveryState(DeliveryState.DELIVERED);
                    try {
                        webSocketController.onNewMessage(message);
                    } catch (Exception e) {
                        log.error("Failed delivering message via websocket: {}", message, e);
                        message.setDeliveryState(DeliveryState.FAILED);
                    }
                    return message;
                })
                .to(applicationCommunicationMessages);

        builder.<String, Channel>table(new ApplicationCommunicationChannels().name())
                .filter((channelId, channel) -> "chat_plugin".equals(channel.getSource())
                                && ChannelConnectionState.CONNECTED.equals(channel.getConnectionState()),
                        Materialized.as(channelStore));

        streams.start(builder.build(), appId);
    }

    public void sendMessage(Message message) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMessages, message.getId(), message)).get();
    }

    private ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelStore);
    }

    public Channel getChannel(String channelId) {
        final ReadOnlyKeyValueStore<String, Channel> store = getChannelsStore();
        return store.get(channelId);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        startStream();
    }

    @Override
    public Health health() {
        getChannelsStore();
        return Health.status(Status.UP).build();
    }
}

