package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "sources.facebook.ConnectorStores";

    private final KafkaStreamsWrapper streams;
    private final String channelsStore = "channels-store";
    private final String allChannelsKey = "ALL";
    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

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
                }, Materialized.as(channelsStore));

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Map<String, Channel>> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    public Map<String, Channel> getChannelsMap() {
        final ReadOnlyKeyValueStore<String, Map<String, Channel>> channelsStore = getChannelsStore();

        return Optional.ofNullable(channelsStore.get(allChannelsKey)).orElse(Map.of());
    }

    @Override
    public void destroy() throws Exception {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        startStream();
    }
}
