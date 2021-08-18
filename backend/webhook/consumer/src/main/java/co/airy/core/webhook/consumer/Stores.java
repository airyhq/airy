package co.airy.core.webhook.consumer;

import co.airy.avro.communication.Webhook;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "webhook.Consumer";
    private final String webhooksStore = "webhook-store";
    private final KafkaStreamsWrapper streams;

    public Stores(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();
        builder.<String, Webhook>table(new ApplicationCommunicationWebhooks().name(), Materialized.as(webhooksStore));
        streams.start(builder.build(), appId);
    }

    private ReadOnlyKeyValueStore<String, Webhook> getWebhookStore() {
        return streams.acquireLocalStore(webhooksStore);
    }

    public Webhook getWebhook(String id) {
        final ReadOnlyKeyValueStore<String, Webhook> store = getWebhookStore();
        return store.get(id);
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

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
