package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceGoogleEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.uuid.UUIDV5;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;

import java.time.Instant;
import java.util.Map;

public class EventsRouter implements DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final String appId = "sources.google.EventsRouter";
    private static final Logger log = AiryLoggerFactory.getLogger(EventsRouter.class);

    private final KafkaStreamsWrapper streams;
    private final ObjectMapper objectMapper;
    private final MessageParser messageParser;

    public EventsRouter(KafkaStreamsWrapper streams, ObjectMapper objectMapper, MessageParser messageParser) {
        this.streams = streams;
        this.objectMapper = objectMapper;
        this.messageParser = messageParser;
    }

    @Override
    public void destroy() throws Exception {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        startStream();
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .groupBy((k, v) -> v.getSourceChannelId())
                .reduce((aggValue, newValue) -> newValue)
                .filter((sourceChannelId, channel) -> "google".equalsIgnoreCase(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

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

                    GoogleEventInfo googleEventInfo = GoogleInfoExtractor.extract(webhookEvent);
                    googleEventInfo.setEventPayload(sourceEvent);

                    return KeyValue.pair(googleEventInfo.getAgentId(), googleEventInfo);
                })
                .join(channelsTable, (event, channel) -> event.toBuilder().channel(channel).build())
                .map((agentId, event) -> {
                    final Channel channel = event.getChannel();
                    final String payload = event.getEventPayload();

                    final String messageId = UUIDV5.fromNamespaceAndName(channel.getId(), payload).toString();
                    final String conversationId = UUIDV5.fromNamespaceAndName(channel.getId(), event.getConversationId()).toString();
                    final String sourceConversationId = event.getConversationId();

                    if (!messageParser.isMessage(payload)) {
                        return KeyValue.pair(messageId, null);
                    }
                    Message.Builder messageBuilder = Message.newBuilder();
                    return KeyValue.pair(
                            messageId,
                            messageBuilder
                                    .setSource("google")
                                    .setDeliveryState(DeliveryState.DELIVERED)
                                    .setId(messageId)
                                    .setChannelId(channel.getId())
                                    .setConversationId(conversationId)
                                    .setSenderType(SenderType.SOURCE_CONTACT)
                                    .setContent(payload)
                                    .setSenderId(sourceConversationId)
                                    .setHeaders(Map.of()) // TODO we can add place Id
                                    .setSentAt(Instant.now().toEpochMilli())
                                    .setUpdatedAt(null)
                                    .build()
                    );
                })
                .filter((messageId, message) -> message != null)
                .to(new ApplicationCommunicationMessages().name());

        streams.start(builder.build(), appId);
    }
}
