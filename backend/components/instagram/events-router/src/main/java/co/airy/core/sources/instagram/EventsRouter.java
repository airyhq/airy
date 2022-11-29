package co.airy.core.sources.instagram;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.instagram.dto.Event;
import co.airy.core.sources.instagram.model.WebhookEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.MetadataRepository;
import co.airy.model.metadata.Subject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@Component
public class EventsRouter implements HealthIndicator, DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(EventsRouter.class);

    private final String metadataStore = "metadata-store";
    private final KafkaStreamsWrapper streams;
    private final ObjectMapper objectMapper;
    private final MessageMapper messageMapper;
    private final KafkaProducer<String, SpecificRecordBase> kafkaProducer;

    EventsRouter(KafkaStreamsWrapper streams, ObjectMapper objectMapper, MessageMapper messageMapper, KafkaProducer<String, SpecificRecordBase> kafkaProducer) {
        this.streams = streams;
        this.objectMapper = objectMapper;
        this.messageMapper = messageMapper;
        this.kafkaProducer = kafkaProducer;
    }

    private static final String appId = "sources.instagram.EventsRouter";

    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final List<String> sources = List.of("facebook", "instagram");

        // Facebook to Airy message id lookup table
        builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .filter((metadataId, metadata) -> metadata.getKey().equals(MetadataKeys.MessageKeys.Source.ID))
                .groupBy((metadataId, metadata) -> KeyValue.pair(metadata.getValue(), metadata))
                .reduce((oldValue, newValue) -> newValue, (oldValue, reduceValue) -> reduceValue, Materialized.as(metadataStore));

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .groupBy((k, v) -> v.getSourceChannelId())
                .reduce((aggValue, newValue) -> newValue)
                .filter((sourceChannelId, channel) -> sources.contains(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        builder.<String, String>stream(new SourceFacebookEvents().name())
                .flatMap((key, event) -> {
                    WebhookEvent webhookEvent;
                    try {
                        webhookEvent = objectMapper.readValue(event, WebhookEvent.class);
                        if (webhookEvent.getEntries() == null) {
                            log.warn("empty entries. key={} event={}", key, event);
                            return Collections.emptyList();
                        }
                    } catch (Exception e) {
                        log.warn("error in record. key={} event={} e={}", key, event, e.toString());
                        return Collections.emptyList();
                    }

                    return webhookEvent.getEntries()
                            .stream()
                            .flatMap(entry -> {
                                List<JsonNode> messagingList = entry.getMessaging() != null ? entry.getMessaging() : entry.getStandby();

                                if (messagingList == null) {
                                    return Stream.empty();
                                }

                                return messagingList.stream().map(messaging -> {
                                    try {
                                        return KeyValue.pair(entry.getId(),
                                                Event.builder()
                                                        .sourceConversationId(messageMapper.getSourceConversationId(messaging))
                                                        .payload(messaging.toString()).build()
                                        );
                                    } catch (Exception e) {
                                        log.warn("Skipping facebook error for record " + entry, e);
                                        return null;
                                    }
                                });
                            })
                            .filter(Objects::nonNull)
                            .collect(toList());
                })
                .join(channelsTable, (event, channel) -> event.toBuilder().channel(channel).build())
                .foreach((facebookPageId, event) -> {
                    try {
                        final List<ProducerRecord<String, SpecificRecordBase>> records = messageMapper.getRecords(event, this::getMessageId);
                        for (ProducerRecord<String, SpecificRecordBase> record : records) {
                            kafkaProducer.send(record).get();
                        }
                    } catch (InterruptedException | ExecutionException e) {
                        log.error("Unable to send records. Terminating thread. " + e);
                        throw new RuntimeException(e);
                    } catch (Exception e) {
                        log.warn("skip facebook record for error: " + event.toString(), e);
                    }
                });

        streams.start(builder.build(), appId);
    }

    public Optional<String> getMessageId(String facebookMessageId) {
        final ReadOnlyKeyValueStore<String, Metadata> store = streams.acquireLocalStore(metadataStore);

        return Optional.ofNullable(store.get(facebookMessageId))
                .map(MetadataRepository::getSubject)
                .map(Subject::getIdentifier);
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        startStream();
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        if (streams == null || !streams.state().isRunningOrRebalancing()) {
            return Health.down().build();
        }
        streams.acquireLocalStore(metadataStore);
        return Health.up().build();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
