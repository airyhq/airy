package co.airy.core.sources.api;

import co.airy.avro.communication.Channel;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "sources.Api";

    private final String channelsStore = "channels-store";
    private final KafkaStreamsWrapper streams;

    public Stores(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.table(new ApplicationCommunicationChannels().name(), Materialized.as(channelsStore));

        streams.start(builder.build(), appId);
    }

    private ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    @Override
    public void destroy() {
        streams.close();
    }

    @Override
    public Health health() {
        getChannelsStore();
        return Health.up().build();
    }

}
