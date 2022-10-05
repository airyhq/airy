package co.airy.core.contacts.util;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
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

@Data
@NoArgsConstructor
public class TestConversation {
    private String channelId;
    private String conversationId;
    private String source;
    private Map<String, String> metadata;
    private long lastMessageSentAt;
    private List<ProducerRecord<String, SpecificRecordBase>> records;

    public static TestConversation from(String source, int messageCount) {
        TestConversation testConversation = new TestConversation();
        testConversation.setConversationId(UUID.randomUUID().toString());
        testConversation.setSource(source);
        testConversation.setChannelId(UUID.randomUUID().toString());
        testConversation.setRecords(testConversation.generateRecords(messageCount));

        return testConversation;
    }

    private List<ProducerRecord<String, SpecificRecordBase>> generateRecords(int messageCount) {
        final List<ProducerRecord<String, SpecificRecordBase>> messages = getMessages(messageCount);
        this.lastMessageSentAt = ((Message) messages.get(messages.size() - 1).value()).getSentAt();
        return new ArrayList<>(messages);
    }


    private List<ProducerRecord<String, SpecificRecordBase>> getMessages(int messageCount) {
        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>();
        Random random = new Random();
        Instant startDate = Instant.now().minus(Duration.ofDays(random.nextInt(365)));
        for (int index = 0; index < messageCount; index++) {
            final String messageId = UUID.randomUUID().toString();
            records.add(new ProducerRecord<>(Topics.applicationCommunicationMessages.name(), messageId, Message.newBuilder()
                    .setId(messageId)
                    .setSentAt(startDate.minus(Duration.ofDays(messageCount - index)).toEpochMilli())
                    .setSenderId("senderId")
                    .setDeliveryState(DeliveryState.DELIVERED)
                    .setSource("facebook")
                    .setConversationId(conversationId)
                    .setHeaders(Map.of())
                    .setChannelId(channelId)
                    .setContent("{\"message\":{\"text\":\"hello world\"}}")
                    .setIsFromContact(true)
                    .build()));
        }

        return records;
    }
}
