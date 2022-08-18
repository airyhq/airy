package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.dto.Event;
import co.airy.core.sources.whatsapp.model.WebhookEntry.Change;
import co.airy.core.sources.whatsapp.model.WebhookEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceWhatsappEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
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

    private static final String appId = "sources.whatsapp.EventsRouter";

    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();


    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .groupBy((k, v) -> v.getSourceChannelId())
                .reduce((aggValue, newValue) -> newValue)
                .filter((sourceChannelId, channel) -> "whatsapp".equals(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        builder.<String, String>stream(new SourceWhatsappEvents().name())
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
                                final List<Change> changes = entry.getChanges();

                                if (changes == null) {
                                    return Stream.empty();
                                }

                                return changes.stream().map(change -> {
                                    try {
                                        final String sourceChannelId = change.getValue().getMetadata().getPhoneNumberId();
                                        return KeyValue.pair(sourceChannelId, Event.builder().payload(change).build()
                                        );
                                    } catch (Exception e) {
                                        log.warn("Skipping whatsapp error for record " + entry, e);
                                        return null;
                                    }
                                });
                            })
                            .filter(Objects::nonNull)
                            .collect(toList());
                })
                .join(channelsTable, (event, channel) -> event.toBuilder().channel(channel).build())
                .flatMap((sourceChannelId, event) -> {
                    try {
                        return messageMapper.getRecords(event);
                    }  catch (Exception e) {
                        log.warn("skip whatsapp record for error: " + event.toString(), e);
                        return List.of();
                    }
                })
                .to((recordId, record, context) -> {
                    if (record instanceof Metadata) {
                        return applicationCommunicationMetadata;
                    }
                    if (record instanceof Message) {
                        return applicationCommunicationMessages;
                    }

                    throw new IllegalStateException("Unknown type for record " + record);
                });


        streams.start(builder.build(), appId);
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
        return Health.up().build();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
