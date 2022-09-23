package co.airy.core.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.communication.util.TestConversation;
import co.airy.core.communication.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class UnreadCountTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canResetUnreadCount() throws Exception {
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(UUID.randomUUID().toString())
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(Topics.applicationCommunicationChannels.name(), channel.getId(), channel));

        final String conversationId = UUID.randomUUID().toString();
        final Integer unreadMessages = 3;

        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, unreadMessages));

        // Messages from Airy should not increase the unread count
        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(Topics.applicationCommunicationMessages.name(), "message-id", Message.newBuilder()
                        .setId("message-id")
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("source-conversation-id")
                        .setDeliveryState(DeliveryState.DELIVERED)
                        .setSource("facebook")
                        .setConversationId(conversationId)
                        .setChannelId(channel.getId())
                        .setContent("from airy")
                        .setIsFromContact(false)
                        .build())
        ));

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";

        retryOnException(() -> webTestHelper.post("/conversations.info", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.metadata.unread_count", is(3.0))),
                "Conversation not showing unread count");

        webTestHelper.post("/conversations.mark-read", payload).andExpect(status().isNoContent());

        retryOnException(
                () -> webTestHelper.post("/conversations.info", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.metadata.unread_count", equalTo(0.0))),
                "Conversation unread count did not reset");
    }
}
