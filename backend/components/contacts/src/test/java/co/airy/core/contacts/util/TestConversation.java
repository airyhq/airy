package co.airy.core.contacts.util;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationMessageContainers;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.dto.MetadataMap;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.Serializable;
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
    private Channel channel;
    private UUID conversationId;
    private String source;
    private Map<String, String> metadata;
    private long lastMessageSentAt;
    private List<ProducerRecord<String, Serializable>> records;

    public static TestConversation from(String source, int messageCount) {
        TestConversation testConversation = new TestConversation();
        testConversation.setConversationId(UUID.randomUUID());
        testConversation.setSource(source);
        testConversation.setChannel(Channel.newBuilder()
                .setId(UUID.randomUUID().toString())
                        .setSource(source)
                        .setSourceChannelId("source-channel-id")
                        .setConnectionState(ChannelConnectionState.CONNECTED).build());
        testConversation.setRecords(testConversation.generateRecords(messageCount));

        return testConversation;
    }

    private List<ProducerRecord<String, Serializable>> generateRecords(int messageCount) {
        final List<ProducerRecord<String, Serializable>> messages = getMessageContainers(messageCount);
        this.lastMessageSentAt = ((Message) messages.get(messages.size() - 1).value()).getSentAt();
        List<ProducerRecord<String, Serializable>> records = new ArrayList<>(messages);

        records.add(new ProducerRecord<>(Topics.applicationCommunicationConversations.name(), conversationId.toString(),
                Conversation.builder()
                        .channelContainer(ChannelContainer.builder().channel(channel).build())
                        .sourceConversationId("source-conversation-id")
                        .lastMessageContainer((MessageContainer) messages.get(0).value())
                        .metadataMap(new MetadataMap())
                        .build()
                ));

        return records;
    }

    private List<ProducerRecord<String, Serializable>> getMessageContainers(int messageCount) {
        List<ProducerRecord<String, Serializable>> records = new ArrayList<>();
        Random random = new Random();
        Instant startDate = Instant.now().minus(Duration.ofDays(random.nextInt(365)));
        for (int index = 0; index < messageCount; index++) {
            final String messageId = UUID.randomUUID().toString();
            records.add(new ProducerRecord<>(Topics.applicationCommunicationMessageContainers.name(), messageId,
                    MessageContainer.builder()
                            .message(
                                    Message.newBuilder()
                                            .setId(messageId)
                                            .setSentAt(startDate.minus(Duration.ofDays(messageCount - index)).toEpochMilli())
                                            .setSenderId("senderId")
                                            .setDeliveryState(DeliveryState.DELIVERED)
                                            .setSource(source)
                                            .setConversationId(conversationId.toString())
                                            .setHeaders(Map.of())
                                            .setChannelId(channel.getId())
                                            .setContent("{\"message\":{\"text\":\"hello world\"}}")
                                            .setIsFromContact(true)
                                            .build())
                            .metadataMap(new MetadataMap()).build()));
        }

        return records;
    }
}
