package co.airy.core.api.websocket;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isChannelMetadata;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.WebsocketStores";
    private final KafkaStreamsWrapper streams;
    private final WebSocketController webSocketController;

    Stores(KafkaStreamsWrapper streams,
           WebSocketController webSocketController
    ) {
        this.streams = streams;
        this.webSocketController = webSocketController;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .peek((messageId, message) -> webSocketController.onMessage(message));

        builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .peek((channelId, channel) -> webSocketController.onChannel(channel));

        builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor)
                .toStream()
                .peek((identifier, metadataMap) -> webSocketController.onMetadata(metadataMap));

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        return Health.status(Status.UP).build();
    }
}
