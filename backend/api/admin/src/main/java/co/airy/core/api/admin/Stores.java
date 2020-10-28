package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
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
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.AdminStores";

    private final KafkaStreamsWrapper streams;

    private final String CHANNELS_STORE = "channels-store";
    private final String TAGS_STORE = "tags-store";
    private final String WEBHOOKS_STORE = "webhook-store";
    private final String allChannelsKey = "ALL";

    // Using a UUID as the default key for the webhook will make it easier
    // to add multiple webhooks if that ever becomes a requirement
    private final String allWebhooksKey = "339ab777-92aa-43a5-b452-82e73c50fc59";

    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final String applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks().name();
    private final String applicationCommunicationTags = new ApplicationCommunicationTags().name();

    public Stores(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Channel>stream(applicationCommunicationChannels)
                .groupBy((k, v) -> allChannelsKey)
                .aggregate(HashMap::new, (allKey, channel, channelsMap) -> {
                    // An external channel id may only be connected once
                    channelsMap.put(channel.getId(), channel);
                    return channelsMap;
                }, Materialized.as(CHANNELS_STORE));

        builder.<String, Webhook>stream(applicationCommunicationWebhooks)
                .groupBy((webhookId, webhook) -> allWebhooksKey)
                .reduce((oldValue, newValue) -> newValue, Materialized.as(WEBHOOKS_STORE));

        builder.<String, Tag>table(applicationCommunicationTags, Materialized.as(TAGS_STORE));

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Map<String, Channel>> getChannelsStore() {
        return streams.acquireLocalStore(CHANNELS_STORE);
    }

    public ReadOnlyKeyValueStore<String, Webhook> getWebhookStore() {
        return streams.acquireLocalStore(WEBHOOKS_STORE);
    }

    public ReadOnlyKeyValueStore<String, Tag> getTagsStore() {
        return streams.acquireLocalStore(TAGS_STORE);
    }

    @Autowired
    KafkaProducer<String, SpecificRecordBase> producer;

    public void storeChannel(Channel channel) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
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

    public Map<String, Channel> getChannelsMap() {
        final ReadOnlyKeyValueStore<String, Map<String, Channel>> channelsStore = getChannelsStore();

        return Optional.ofNullable(channelsStore.get(allChannelsKey)).orElse(Map.of());
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
    public void onApplicationEvent(ApplicationStartedEvent event) {
        startStream();
    }

    @Override
    public Health health() {
        getChannelsStore();
        getWebhookStore();
        getTagsStore();

        return Health.status(Status.UP).build();
    }
}
