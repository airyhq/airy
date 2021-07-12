package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.chat_plugin.dto.MessagesTreeSet;
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

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static co.airy.model.message.MessageRepository.updateDeliveryState;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final Logger log = AiryLoggerFactory.getLogger(Stores.class);
    private static final String appId = "sources.ChatPluginStores";

    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final KafkaStreamsWrapper streams;
    private final WebSocketController webSocketController;
    private final KafkaProducer<String, Message> producer;
    private final String channelStore = "channel-store";
    private final String messagesStore = "messages-store";

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
                .filter((messageId, message) -> message != null && "chatplugin".equals(message.getSource()));

        // Messages store
        messageStream
                .groupBy((messageId, message) -> message.getConversationId())
                .aggregate(MessagesTreeSet::new, ((key, value, aggregate) -> {
                    aggregate.add(value);
                    return aggregate;
                }), Materialized.as(messagesStore));

        // Client Echoes
        messageStream.filter((messageId, message) -> message.getIsFromContact())
                .peek((messageId, message) -> webSocketController.onNewMessage(message));

        // Runtime Outbound
        messageStream.filter((messageId, message) -> !message.getIsFromContact()
                && message.getDeliveryState().equals(DeliveryState.PENDING)
        )
                .mapValues((messageId, message) -> {
                    updateDeliveryState(message, DeliveryState.DELIVERED);
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
                .filter((channelId, channel) -> "chatplugin".equals(channel.getSource())
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

    public ReadOnlyKeyValueStore<String, MessagesTreeSet> getMessagesStore() {
        return streams.acquireLocalStore(messagesStore);
    }

    public Channel getChannel(String channelId) {
        final ReadOnlyKeyValueStore<String, Channel> store = getChannelsStore();
        return store.get(channelId);
    }

    public List<Message> getMessages(String conversationId) {
        final ReadOnlyKeyValueStore<String, MessagesTreeSet> messagesStore = getMessagesStore();
        final MessagesTreeSet messagesTreeSet = messagesStore.get(conversationId);

        return messagesTreeSet == null ? List.of() : new ArrayList<>(messagesTreeSet);
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

