package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.sources.facebook.model.WebhookEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.uuid.UUIDV5;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.javatuples.Pair;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.toList;

@Component
public class EventsRouter implements DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(EventsRouter.class);

    @Autowired
    private KafkaStreamsWrapper streams;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MessageParser messageParser;

    private final String appId = "sources.facebook.EventsRouter";

    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .groupBy((k, v) -> v.getSourceChannelId())
                .reduce((aggValue, newValue) -> newValue)
                .filter((sourceChannelId, channel) -> "facebook".equalsIgnoreCase(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        // Inbound
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

                                return messagingList.stream().map(messaging -> {
                                    try {
                                        return KeyValue.pair(entry.getId(), Pair.with(messageParser.getSourceConversationId(messaging), messaging.toString()));
                                    } catch (Exception e) {
                                        log.warn("Skipping facebook error for record " + entry.toString(), e);
                                        return null;
                                    }
                                });
                            })
                            .filter(Objects::nonNull)
                            .collect(toList());
                })
                .join(channelsTable, Pair::add)
                .map((facebookId, triplet) -> {
                    final String sourceConversationId = triplet.getValue0();
                    final String payload = triplet.getValue1();
                    final Channel channel = triplet.getValue2();

                    final String conversationId = UUIDV5.fromNamespaceAndName(channel.getId(), sourceConversationId).toString();
                    final String messageId = UUIDV5.fromNamespaceAndName(channel.getId(), payload).toString();

                    try {
                        final Message.Builder messageBuilder = messageParser.parse(payload);

                        return KeyValue.pair(
                                messageId,
                                messageBuilder
                                        .setSource("facebook")
                                        .setDeliveryState(DeliveryState.DELIVERED)
                                        .setId(messageId)
                                        .setChannelId(channel.getId())
                                        .setConversationId(conversationId)
                                        .build()
                        );
                    } catch (NotAMessageException e) {
                        // This way we filter out conversation events and echoes
                        return KeyValue.pair("skip", null);
                    } catch (Exception e) {
                        log.warn("skip facebook record for error" + triplet, e);
                        return KeyValue.pair("skip", null);
                    }
                })
                .filter((conversationId, message) -> message != null)
                .to(new ApplicationCommunicationMessages().name());

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

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
