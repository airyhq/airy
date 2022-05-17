package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceGoogleEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.uuid.UUIDv5;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static co.airy.core.sources.google.InfoExtractor.getMetadataFromContext;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@Component
public class EventsRouter implements HealthIndicator, DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final String appId = "sources.google.EventsRouter";
    private static final Logger log = AiryLoggerFactory.getLogger(EventsRouter.class);

    private final KafkaStreamsWrapper streams;
    private final ObjectMapper objectMapper;

    public EventsRouter(KafkaStreamsWrapper streams, @Qualifier("googleObjectMapper") ObjectMapper objectMapper) {
        this.streams = streams;
        this.objectMapper = objectMapper;
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        startStream();
    }

    @Override
    public Health health() {
        if (streams == null || !streams.state().isRunningOrRebalancing()) {
            return Health.down().build();
        }
        return Health.up().build();
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();
        final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
        final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .filter((channelId, channel) -> "google".equalsIgnoreCase(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED))
                .groupBy((k, v) -> v.getSourceChannelId())
                .reduce((aggValue, newValue) -> newValue);

        builder.<String, String>stream(new SourceGoogleEvents().name())
                .map((key, sourceEvent) -> {
                    WebhookEvent webhookEvent;
                    try {
                        webhookEvent = objectMapper.readValue(sourceEvent, WebhookEvent.class);
                        if (webhookEvent.getPayload() == null) {
                            log.warn("empty message. key={} event={}", key, sourceEvent);
                            return KeyValue.pair("skip", null);
                        }
                    } catch (Exception e) {
                        log.warn("error in record. key={} event={} e={}", key, sourceEvent, e.toString());
                        return KeyValue.pair("skip", null);
                    }

                    final EventInfo eventInfo = InfoExtractor.extract(webhookEvent);
                    eventInfo.setEvent(webhookEvent);
                    eventInfo.setTimestamp(Instant.parse(webhookEvent.getSendTime()).toEpochMilli());

                    if (!webhookEvent.hasMessage() && !webhookEvent.hasContext()) {
                        return KeyValue.pair(eventInfo.getAgentId(), null);
                    }

                    return KeyValue.pair(eventInfo.getAgentId(), eventInfo);
                })
                .filter((agentId, event) -> event != null)
                .join(channelsTable, (event, channel) -> event.toBuilder().channel(channel).build())
                .flatMap((agentId, event) -> {
                    final Channel channel = event.getChannel();
                    final WebhookEvent webhookEvent = event.getEvent();

                    String payload;
                    try {
                        payload = objectMapper.writeValueAsString(webhookEvent);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                    final String sourceConversationId = event.getSourceConversationId();
                    final String conversationId = UUIDv5.fromNamespaceAndName(channel.getId(), sourceConversationId).toString();
                    final List<KeyValue<String, SpecificRecordBase>> records = new ArrayList<>();

                    final String messageId = UUIDv5.fromNamespaceAndName(channel.getId(), payload).toString();
                    if (webhookEvent.hasMessage()) {
                        records.add(KeyValue.pair(messageId,
                                Message.newBuilder()
                                        .setSource(channel.getSource())
                                        .setDeliveryState(DeliveryState.DELIVERED)
                                        .setIsFromContact(true)
                                        .setId(messageId)
                                        .setChannelId(channel.getId())
                                        .setConversationId(conversationId)
                                        .setContent(payload)
                                        .setSenderId(sourceConversationId)
                                        .setHeaders(event.getMessageHeaders())
                                        .setSentAt(event.getTimestamp())
                                        .setUpdatedAt(null)
                                        .build()
                        ));

                        webhookEvent.getLiveAgentRequest()
                                .ifPresent((liveAgentRequest) -> {
                                    if (liveAgentRequest) {
                                        final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.STATE, "OPEN");
                                        records.add(KeyValue.pair(getId(metadata).toString(), metadata));
                                    }
                                });
                    }

                    if (webhookEvent.hasContext()) {
                        final List<Metadata> metadataFromContext = getMetadataFromContext(conversationId, webhookEvent);

                        for (Metadata metadata : metadataFromContext) {
                            records.add(KeyValue.pair(getId(metadata).toString(), metadata));
                        }
                    }

                    return records;
                })
                .filter((recordId, record) -> record != null)
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

    // Visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
