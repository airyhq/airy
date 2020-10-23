package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@Component
@RestController
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "sources.ChatPlugin";

    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final KafkaStreamsWrapper streams;
    private final WebSocketController webSocketController;
    private final KafkaProducer<String, Message> producer;
    private final String CHANNEL_STORE = "channel-store";

    Stores(KafkaStreamsWrapper streams,
           KafkaProducer<String, Message> producer,
           WebSocketController webSocketController) {
        this.streams = streams;
        this.producer = producer;
        this.webSocketController = webSocketController;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Message>stream(applicationCommunicationMessages)
                .peek((messageId, message) -> webSocketController.onNewMessage(message));

        builder.<String, Channel>table(new ApplicationCommunicationChannels().name())
                .filter((channelId, channel) -> "chat_plugin".equals(channel.getSource())
                                && ChannelConnectionState.CONNECTED.equals(channel.getConnectionState()),
                        Materialized.as(CHANNEL_STORE));

        streams.start(builder.build(), appId);
    }

    public void sendMessage(Message message) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMessages, message.getId(), message)).get();
    }

    public ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(CHANNEL_STORE);
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

    @GetMapping("/health")
    ResponseEntity<Void> health() {
        getChannelsStore();
        return ResponseEntity.ok().build();
    }
}

