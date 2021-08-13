package co.airy.core.webhook.publisher;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.event.payload.Event;
import co.airy.model.event.payload.MessageUpdated;
import co.airy.model.event.payload.MetadataUpdated;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.Serializable;

import static co.airy.model.metadata.MetadataRepository.getSubject;

@Component
public class Publisher implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private final Logger log = AiryLoggerFactory.getLogger(Publisher.class);

    private static final String appId = "webhook.Publisher";
    private final String webhooksStore = "webhook-store";
    private final String allWebhooksKey = "339ab777-92aa-43a5-b452-82e73c50fc59";
    private final KafkaStreamsWrapper streams;
    private final BeanstalkPublisher beanstalkdPublisher;

    public Publisher(KafkaStreamsWrapper streams, BeanstalkPublisher beanstalkdPublisher) {
        this.streams = streams;
        this.beanstalkdPublisher = beanstalkdPublisher;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Webhook>stream(new ApplicationCommunicationWebhooks().name())
                .groupBy((webhookId, webhook) -> allWebhooksKey)
                .reduce((oldValue, newValue) -> newValue, Materialized.as(webhooksStore));

        builder.<String, Message>stream(new ApplicationCommunicationMessages().name(), Consumed.with(Topology.AutoOffsetReset.LATEST))
                .filter((messageId, message) -> message != null && message.getUpdatedAt() == null)
                .foreach((messageId, message) -> publishRecord(message));

        builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor)
                .toStream()
                .peek((identifier, metadataMap) -> publishRecord(metadataMap));

        streams.start(builder.build(), appId);
    }

    private void publishRecord(Serializable record) {
        try {
            final ReadOnlyKeyValueStore<String, Webhook> webhookStore = streams.acquireLocalStore(webhooksStore);
            final Webhook webhook = webhookStore.get(allWebhooksKey);

            if (webhook != null && webhook.getStatus().equals(Status.Subscribed)) {
                beanstalkdPublisher.publishMessage(fromRecord(record));
            }
        } catch (Exception e) {
            log.error("failed to publish record", e);
        }
    }

    private Event fromRecord(Serializable record) throws Exception {
        if (record instanceof Message) {
            return MessageUpdated.fromMessage((Message) record);
        } else if (record instanceof MetadataMap) {
            return MetadataUpdated.fromMetadataMap((MetadataMap) record);
        }

        throw new Exception("unknown type for record " + record);
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
