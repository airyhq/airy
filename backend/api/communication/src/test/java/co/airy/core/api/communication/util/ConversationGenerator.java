package co.airy.core.api.communication.util;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataAction;
import co.airy.avro.communication.MetadataActionType;
import co.airy.avro.communication.SenderType;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import lombok.Builder;
import lombok.Data;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;

public class ConversationGenerator {

    @Data
    @Builder
    public static class CreateConversation {
        Channel channel;
        String conversationId;
        Map<String, String> metadata;
        Long messageCount;
    }

    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    public static List<ProducerRecord<String, SpecificRecordBase>> getConversationRecords(List<CreateConversation> conversations) {
        return conversations.stream()
                .map(ConversationGenerator::getConversationRecords)
                .flatMap(Collection::stream)
                .collect(toList());
    }

    public static List<ProducerRecord<String, SpecificRecordBase>> getConversationRecords(CreateConversation conversation) {
        final String conversationId = conversation.getConversationId();
        final Channel channel = conversation.getChannel();

        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>(getMessages(conversation.getMessageCount().intValue(), channel.getId(), conversationId));

        if (conversation.getMetadata() != null) {
            conversation.getMetadata().forEach((metadataKey, metadataValue) ->
                    records.add(new ProducerRecord<>(applicationCommunicationMetadata.name(), conversationId,
                            MetadataAction.newBuilder()
                                    .setKey(metadataKey)
                                    .setValue(metadataValue)
                                    .setConversationId(conversationId)
                                    .setActionType(MetadataActionType.SET)
                                    .setTimestamp(Instant.now().toEpochMilli())
                                    .build()
                    )));
        }

        return records;
    }

    public static List<ProducerRecord<String, SpecificRecordBase>> getMessages(Integer messageCount, String channelId, String conversationId) {
        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>();

        IntStream.range(0, messageCount)
                .forEach(index -> {
                    final String messageId = UUID.randomUUID().toString();
                    records.add(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId, Message.newBuilder()
                            .setId(messageId)
                            .setSentAt(Instant.now().toEpochMilli() - (messageCount - index) * 1_000)
                            .setSenderId("source-conversation-id")
                            .setDeliveryState(DeliveryState.DELIVERED)
                            .setSource("facebook")
                            .setSenderType(SenderType.SOURCE_CONTACT)
                            .setConversationId(conversationId)
                            .setHeaders(Map.of())
                            .setChannelId(channelId)
                            .setContent("{\"message\":{\"text\":\"hello world\"}}")
                            .build()));
                });

        return records;
    }
}
