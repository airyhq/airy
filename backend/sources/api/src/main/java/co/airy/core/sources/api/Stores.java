package co.airy.core.sources.api;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Source;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationSources;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
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

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "sources.Api";

    private final String channelsStore = "channels-store";
    private final String sourcesStore = "sources-store";
    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecord> producer;

    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationSources = new ApplicationCommunicationSources().name();

    public Stores(KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecord> producer) {
        this.streams = streams;
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.table(new ApplicationCommunicationChannels().name(), Materialized.as(channelsStore));
        builder.table(new ApplicationCommunicationSources().name(), Materialized.as(sourcesStore));

        streams.start(builder.build(), appId);
    }

    public void storeSource(Source source) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationSources, source.getId(), source)).get();
    }

    public void deleteSource(String sourceId) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationSources, sourceId, null)).get();
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

    private ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    private ReadOnlyKeyValueStore<String, Source> getSourcesStore() {
        return streams.acquireLocalStore(sourcesStore);
    }

    public Source getSource(String id) {
        final ReadOnlyKeyValueStore<String, Source> store = getSourcesStore();
        return store.get(id);
    }

    public List<Source> getAllSources() {
        final ReadOnlyKeyValueStore<String, Source> store = getSourcesStore();
        final ArrayList<Source> sources = new ArrayList<>();
        store.all().forEachRemaining((record) -> sources.add(record.value));
        return sources;
    }

    @Override
    public void destroy() {
        streams.close();
    }

    @Override
    public Health health() {
        getChannelsStore();
        getSourcesStore();
        return Health.up().build();
    }

}
