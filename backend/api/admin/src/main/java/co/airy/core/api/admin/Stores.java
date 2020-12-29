package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Tag;
import co.airy.avro.communication.Webhook;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.AdminStores";

    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;

    private final String connectedChannelsStore = "connected-channels-store";
    private final String tagsStore = "tags-store";
    private final String webhooksStore = "webhook-store";

    // Using a UUID as the default key for the webhook will make it easier
    // to add multiple webhooks if that ever becomes a requirement
    private final String allWebhooksKey = "339ab777-92aa-43a5-b452-82e73c50fc59";

    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final String applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks().name();
    private final String applicationCommunicationTags = new ApplicationCommunicationTags().name();

    public Stores(KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecordBase> producer) {
        this.streams = streams;
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Channel>table(applicationCommunicationChannels)
                .filter((k, v) -> v.getConnectionState().equals(ChannelConnectionState.CONNECTED), Materialized.as(connectedChannelsStore));

        builder.<String, Webhook>stream(applicationCommunicationWebhooks)
                .groupBy((webhookId, webhook) -> allWebhooksKey)
                .reduce((oldValue, newValue) -> newValue, Materialized.as(webhooksStore));

        builder.<String, Tag>table(applicationCommunicationTags, Materialized.as(tagsStore));

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Webhook> getWebhookStore() {
        return streams.acquireLocalStore(webhooksStore);
    }

    public ReadOnlyKeyValueStore<String, Tag> getTagsStore() {
        return streams.acquireLocalStore(tagsStore);
    }

    public void storeWebhook(Webhook webhook) throws ExecutionException, InterruptedException {
        webhook.setId(allWebhooksKey);
        producer.send(new ProducerRecord<>(applicationCommunicationWebhooks, allWebhooksKey, webhook)).get();
    }

    public void storeTag(Tag tag) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationTags, tag.getId(), tag)).get();
    }

    public void deleteTag(Tag tag) {
        producer.send(new ProducerRecord<>(applicationCommunicationTags, tag.getId(), null));
    }

    public ReadOnlyKeyValueStore<String, Channel> getConnectedChannelsStore() {
        return streams.acquireLocalStore(connectedChannelsStore);
    }

    public List<Channel> getChannels() {
        final ReadOnlyKeyValueStore<String, Channel> store = getConnectedChannelsStore();

        final KeyValueIterator<String, Channel> iterator = store.all();

        List<Channel> channels = new ArrayList<>();
        iterator.forEachRemaining(kv -> channels.add(kv.value));

        return channels;
    }

    public Webhook getWebhook() {
        final ReadOnlyKeyValueStore<String, Webhook> webhookStore = getWebhookStore();

        return webhookStore.get(allWebhooksKey);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        getConnectedChannelsStore();
        getWebhookStore();
        getTagsStore();

        return Health.up().build();
    }
}
