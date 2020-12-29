package co.airy.core.api.communication.util;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
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

import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@Data
@NoArgsConstructor
public class TestConversation {
    private static final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private static final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();

    private Channel channel;
    private String conversationId;
    private Map<String, String> metadata;
    private int messageCount;
    private long lastMessageSentAt;
    private List<ProducerRecord<String, SpecificRecordBase>> records;

    public static TestConversation from(String conversationId, Channel channel, int messageCount) {
        TestConversation testConversation = new TestConversation();
        testConversation.setConversationId(conversationId);
        testConversation.setChannel(channel);
        testConversation.setMessageCount(messageCount);
        testConversation.setRecords(testConversation.generateRecords());

        return testConversation;
    }

    public static TestConversation from(String conversationId, Channel channel, Map<String, String> metadata, int messageCount) {
        TestConversation testConversation = new TestConversation();
        testConversation.setConversationId(conversationId);
        testConversation.setChannel(channel);
        testConversation.setMessageCount(messageCount);
        testConversation.setMetadata(metadata);
        testConversation.setRecords(testConversation.generateRecords());

        return testConversation;
    }

    public static List<ProducerRecord<String, SpecificRecordBase>> generateRecords(String conversationId, Channel channel, int messageCount) {
        return TestConversation.from(conversationId, channel, messageCount).generateRecords();
    }

    private List<ProducerRecord<String, SpecificRecordBase>> generateRecords() {
        final List<ProducerRecord<String, SpecificRecordBase>> messages = getMessages();
        this.lastMessageSentAt = ((Message) messages.get(messages.size() - 1).value()).getSentAt();
        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>(messages);

        if (metadata != null) {
            metadata.forEach((metadataKey, metadataValue) ->
                    records.add(new ProducerRecord<>(applicationCommunicationMetadata, conversationId,
                            newConversationMetadata(conversationId, metadataKey, metadataValue)
                    )));
        }

        return records;
    }

    private List<ProducerRecord<String, SpecificRecordBase>> getMessages() {
        List<ProducerRecord<String, SpecificRecordBase>> records = new ArrayList<>();
        Random random = new Random();
        Instant startDate = Instant.now().minus(Duration.ofDays(random.nextInt(365)));
        for (int index = 0; index < messageCount; index++) {
            final String messageId = UUID.randomUUID().toString();
            records.add(new ProducerRecord<>(applicationCommunicationMessages, messageId, Message.newBuilder()
                    .setId(messageId)
                    .setSentAt(startDate.minus(Duration.ofDays(messageCount - index)).toEpochMilli())
                    .setSenderId("source-conversation-id")
                    .setDeliveryState(DeliveryState.DELIVERED)
                    .setSource("facebook")
                    .setSenderType(SenderType.SOURCE_CONTACT)
                    .setConversationId(conversationId)
                    .setHeaders(Map.of())
                    .setChannelId(channel.getId())
                    .setContent("{\"message\":{\"text\":\"hello world\"}}")
                    .build()));
        }

        return records;
    }
}
