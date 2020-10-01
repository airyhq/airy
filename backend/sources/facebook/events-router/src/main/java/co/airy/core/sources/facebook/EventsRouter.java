package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SendMessageRequest;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.facebook.model.SendMessagePayload;
import co.airy.core.sources.facebook.model.WebhookEvent;
import co.airy.core.sources.facebook.services.Api;
import co.airy.core.sources.facebook.services.Mapper;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.schema.source.SourceFacebookSendMessageRequests;
import co.airy.kafka.schema.source.SourceFacebookTransformedEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.uuid.UUIDV5;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.javatuples.Pair;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.time.Instant;
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
    private KafkaProducer<String, Message> producer;

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

        // Outbound
        final KStream<String, Message> outboundStream = builder.<String, SendMessageRequest>stream(new SourceFacebookSendMessageRequests().name())
                .mapValues(this::sendMessage);

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
                .through(new SourceFacebookTransformedEvents().name())
                .map((facebookId, triplet) -> {
                    final String sourceConversationId = triplet.getValue0();
                    final String payload = triplet.getValue1();
                    final Channel channel = triplet.getValue2();

                    final String conversationId = UUIDV5.fromNamespaceAndName(channel.getId(), sourceConversationId).toString();
                    final String messageId = UUIDV5.fromNamespaceAndName(channel.getId(), payload).toString();

                    try {
                        final Message.Builder messageBuilder = messageParser.parse(payload);

                        final String senderId = SenderType.APP_USER.equals(messageBuilder.getSenderType()) ? channel.getId() : messageBuilder.getSenderId();

                        return KeyValue.pair(
                                conversationId,
                                messageBuilder
                                        .setId(messageId)
                                        .setSenderId(senderId)
                                        .setChannelId(channel.getId())
                                        .setOffset(0L)
                                        .setConversationId(conversationId)
                                        .build()
                        );
                    } catch (NotAMessageException e) {
                        // This way we filter out conversation events
                        return KeyValue.pair("skip", null);
                    } catch (Exception e) {
                        log.warn("skip facebook record for error" + triplet, e);
                        return KeyValue.pair("skip", null);
                    }
                })
                .merge(outboundStream)
                .filter((conversationId, message) -> message != null)
                .groupByKey()
                .aggregate(() -> ConversationAggregationDTO.builder()
                                .message(null)
                                .offset(0L)
                                .build()
                        , (aggKey, message, aggregate) -> {
                            final long newOffset = aggregate.getOffset() + 1;
                            message.setOffset(newOffset);

                            return ConversationAggregationDTO.builder()
                                    .message(message)
                                    .offset(newOffset)
                                    .build();
                        })
                .toStream()
                .foreach(
                        (conversationId, aggregationDTO) -> {
                            final Message message = aggregationDTO.getMessage();
                            try {
                                producer.send(new ProducerRecord<>(new ApplicationCommunicationMessages().name(), message.getId(), message)).get();
                            } catch (Exception e) {
                                log.error("Failed to produce message {}", message, e);
                            }
                        });

        streams.start(builder.build(), appId);
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    static class ConversationAggregationDTO implements Serializable {
        Long offset;
        Message message;
    }

    @Autowired
    Mapper mapper;

    @Autowired
    Api api;

    private Message sendMessage(SendMessageRequest sendMessageRequest) {
        try {
            final String pageToken = sendMessageRequest.getToken();
            final SendMessagePayload fbSendMessagePayload = mapper.fromSendMessageRequest(sendMessageRequest);

            api.sendMessage(pageToken, fbSendMessagePayload);

            return sendMessageRequest.getMessage();
        } catch (ApiException e) {
            log.error(
                    String.format("Failed to send a message to Facebook \n SendMessageRequest: %s \n FB Error Message: %s \n", sendMessageRequest, e.getMessage()), e
            );
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to Facebook \n SendMessageRequest: %s", sendMessageRequest), e);
        }

        return null;
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
