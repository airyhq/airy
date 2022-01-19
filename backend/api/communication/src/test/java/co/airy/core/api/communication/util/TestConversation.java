package co.airy.core.api.communication.util;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@Data
@NoArgsConstructor
public class TestConversation {
    private static final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private static final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();

    private Channel channel;
    private String conversationId;
    private Map<String, String> metadata;
    private long lastMessageSentAt;
    private List<ProducerRecord<String, SpecificRecordBase>> records;

    public static TestConversation from(String conversationId, Channel channel, int messageCount) {
        TestConversation testConversation = new TestConversation();
        testConversation.setConversationId(conversationId);
        testConversation.setChannel(channel);
        testConversation.setRecords(testConversation.generateRecords(messageCount));

        return testConversation;
    }

    public static TestConversation from(String conversationId, Channel channel, Map<String, String> metadata, int messageCount) {
        TestConversation testConversation = new TestConversation();
        testConversation.setConversationId(conversationId);
        testConversation.setChannel(channel);
        testConversation.setMetadata(metadata);
        testConversation.setRecords(testConversation.generateRecords(messageCount));

        return testConversation;
    }

    public static List<ProducerRecord<String, SpecificRecordBase>> generateRecords(String conversationId, Channel channel, int messageCount) {
        return TestConversation.generateRecords(conversationId, channel, messageCount, "airy-core-anonymous");
    }

    public static List<ProducerRecord<String, SpecificRecordBase>> generateRecords(String conversationId, Channel channel, int messageCount, String senderId) {
        return TestConversation.from(conversationId, channel, messageCount).generateRecords(messageCount, senderId);
    }

    private List<ProducerRecord<String, SpecificRecordBase>> generateRecords(int messageCount) {
        return generateRecords(messageCount, "airy-core-anonymous");
    }

    private List<ProducerRecord<String, SpecificRecordBase>> generateRecords(int messageCount, String senderId) {
        final List<ProducerRecord<String, SpecificRecordBase>> messages = getMessages(messageCount, senderId);
        this.lastMessageSentAt = ((Message) messages.get(messages.size() - 1).value()).getSentAt();
        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>(messages);

        if (metadata != null) {
            metadata.forEach((metadataKey, metadataValue) -> {
                final Metadata metadata = newConversationMetadata(conversationId, metadataKey, metadataValue);
                records.add(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), metadata));
            });
        }

        return records;
    }

    private List<ProducerRecord<String, SpecificRecordBase>> getMessages(int messageCount, String senderId) {
        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>();
        Random random = new Random();
        Instant startDate = Instant.now().minus(Duration.ofDays(random.nextInt(365)));
        for (int index = 0; index < messageCount; index++) {
            final String messageId = UUID.randomUUID().toString();
            records.add(new ProducerRecord<>(applicationCommunicationMessages, messageId, Message.newBuilder()
                    .setId(messageId)
                    .setSentAt(startDate.minus(Duration.ofDays(messageCount - index)).toEpochMilli())
                    .setSenderId(senderId)
                    .setDeliveryState(DeliveryState.DELIVERED)
                    .setSource("facebook")
                    .setConversationId(conversationId)
                    .setHeaders(Map.of())
                    .setChannelId(channel.getId())
                    .setContent("{\"message\":{\"text\":\"hello world\"}}")
                    .setIsFromContact(true)
                    .build()));
        }

        return records;
    }
}
