package co.airy.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Conversation;
import co.airy.avro.communication.ConversationState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationConversationStates;
import co.airy.kafka.schema.application.ApplicationCommunicationConversations;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.payload.headers.SenderType;
import co.airy.sources.facebook.model.WebhookEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Named;
import org.javatuples.Pair;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import co.airy.uuid.UUIDV5;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.toList;

@Component
public class MessagesUpserter implements DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(MessagesUpserter.class);

    @Autowired
    private KafkaStreamsWrapper streams;

    @Autowired
    private ObjectMapper mapper;


    @Autowired
    private KafkaProducer<String, SpecificRecordBase> producer;

    @Autowired
    private MessageParser messageParser;

    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .groupBy((k, v) -> v.getExternalChannelId())
                .reduce((aggValue, newValue) -> newValue);

        builder.<String, String>stream(new SourceFacebookEvents().name())
                .flatMap((key, event) -> {
                    WebhookEvent webhookEvent;
                    try {
                        webhookEvent = mapper.readValue(event, WebhookEvent.class);
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
                                        return KeyValue.pair(entry.getId(), Pair.with(messageParser.getSourceContactId(messaging), messaging.toString()));
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
                    final String sourceContactId = triplet.getValue0();
                    final String payload = triplet.getValue1();
                    final Channel channel = triplet.getValue2();

                    final String conversationId = UUIDV5.fromNamespaceAndName(channel.getId(), sourceContactId).toString();
                    final String messageId = UUIDV5.fromNamespaceAndName(channel.getId(), payload).toString();

                    try {
                        final Message.Builder messageBuilder = messageParser.parse(payload);

                        final String senderId = SenderType.APP_USER.toString().equals(messageBuilder.getSenderType()) ? channel.getId() : messageBuilder.getSenderId();

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
                    } catch (Exception e) {
                        log.warn("Skipping facebook error for record " + triplet, e);
                        return KeyValue.pair("skip", null);
                    }
                })
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
                        (transformedEventKey, aggregationDTO) -> {
                            final Message message = aggregationDTO.getMessage();
                            final long offset = message.getOffset();
                            final String conversationId = message.getConversationId();
                            final String channelId = message.getChannelId();

                            try {
                                if (offset == 1) {
                                    final Conversation conversation = Conversation.newBuilder()
                                            .setId(conversationId)
                                            .setChannelId(channelId)
                                            .setCreatedAt(message.getSentAt())
                                            .setSourceContactId(message.getSenderId()) // Facebook messages are always started by a contact
                                            .setLocale(null)
                                            .build();

                                    final ConversationState conversationState = ConversationState.newBuilder()
                                            .setState("OPEN")
                                            .setCreatedAt(message.getSentAt())
                                            .build();

                                    producer.send(new ProducerRecord<>(new ApplicationCommunicationConversations().name(), conversationId, conversation)).get();
                                    producer.send(new ProducerRecord<>(new ApplicationCommunicationConversationStates().name(), conversationId, conversationState)).get();
                                }

                                producer.send(new ProducerRecord<>(new ApplicationCommunicationMessages().name(), message.getId(), message)).get();

                            } catch (Exception e) {
                                log.error("Failed to upsert message and/or conversation {}", message, e);
                            }
                        },
                        Named.as("transformedEventsAggregateToStreamForEach"));
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ConversationAggregationDTO {
        private Long offset;
        private Message message;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        startStream();
    }

    @Override
    public void destroy() throws Exception {
    }
}
