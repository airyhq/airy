package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Tag;
import co.airy.avro.communication.Webhook;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
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

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isChannelMetadata;

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
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();

    public Stores(KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecordBase> producer) {
        this.streams = streams;
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        final StreamsBuilder builder = new StreamsBuilder();

        // metadata table keyed by channel id
        final KTable<String, MetadataMap> metadataTable = builder.<String, Metadata>table(applicationCommunicationMetadata)
                .filter((metadataId, metadata) -> isChannelMetadata(metadata))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::Adder, MetadataMap::Subtractor);

        builder.<String, Channel>table(applicationCommunicationChannels)
                .filter((k, v) -> v.getConnectionState().equals(ChannelConnectionState.CONNECTED))
                .leftJoin(metadataTable, ChannelContainer::new, Materialized.as(connectedChannelsStore));

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

    public void storeChannelContainer(ChannelContainer container) throws ExecutionException, InterruptedException {
        storeChannel(container.getChannel());
        storeMetadataMap(container.getMetadataMap());
    }

    public void storeMetadataMap(MetadataMap metadataMap) throws ExecutionException, InterruptedException {
        for (Metadata metadata : metadataMap.values()) {
            producer.send(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), metadata)).get();
        }
    }

    public void storeChannel(Channel channel) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
    }

    public void storeTag(Tag tag) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationTags, tag.getId(), tag)).get();
    }

    public void deleteTag(Tag tag) {
        producer.send(new ProducerRecord<>(applicationCommunicationTags, tag.getId(), null));
    }

    public ReadOnlyKeyValueStore<String, ChannelContainer> getConnectedChannelsStore() {
        return streams.acquireLocalStore(connectedChannelsStore);
    }

    public ChannelContainer getChannel(String channelId) {
        final ReadOnlyKeyValueStore<String, ChannelContainer> store = getConnectedChannelsStore();
        return store.get(channelId);
    }

    public List<ChannelContainer> getChannels() {
        final ReadOnlyKeyValueStore<String, ChannelContainer> store = getConnectedChannelsStore();

        final KeyValueIterator<String, ChannelContainer> iterator = store.all();

        List<ChannelContainer> channels = new ArrayList<>();
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
