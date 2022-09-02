package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.message.dto.MessageContainer;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import co.airy.test.RunnableTest;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationMessages;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@TestMethodOrder(OrderAnnotation.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class SendMessageControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;
    private static final String conversationId = UUID.randomUUID().toString();

    private static final Channel channel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .setToken("AWESOME TOKEN")
            .build();

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private Stores stores;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, getTopics());

        kafkaTestHelper.beforeAll();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));
        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, 1));
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
    @Order(1)
    void canSendMessage() throws Exception {
        final String messagePayload = "{\"text\":\"answeris42\"}";
        final String requestPayload = String.format("{\"conversation_id\":\"%s\"," +
                        "\"message\":%s}",
                conversationId, messagePayload);

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                                "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk()),
                "Could not find conversation"
        );

        final String response = webTestHelper.post("/messages.send", requestPayload)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        final JsonNode responseNode = new ObjectMapper().readTree(response);
        final String messageId = responseNode.get("id").textValue();

        List<ConsumerRecord<String, Message>> records = kafkaTestHelper.consumeRecords(2, applicationCommunicationMessages.name());
        assertThat(records, hasSize(2));

        final Optional<Message> maybeMessage = records.stream()
                .map(ConsumerRecord::value)
                .filter(message -> !message.getIsFromContact() && message.getId().equals(messageId))
                .findFirst();

        if (maybeMessage.isEmpty()) {
            fail("message not present");
        }

        Message message = maybeMessage.get();
        assertThat(message.getContent(), equalTo(messagePayload));

        // Test resend
        final String resendRequestPayload = "{\"message_id\":\"" + message.getId() + "\"}";

        // Message is not in failed state
        webTestHelper.post("/messages.resend", resendRequestPayload)
                .andExpect(status().isConflict());

        message.setDeliveryState(DeliveryState.FAILED);
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message));

        retryOnException(() -> {
            webTestHelper.post("/messages.resend", resendRequestPayload)
                    .andExpect(status().isOk());
        }, "Could not resend message");
    }


    @RequiredArgsConstructor
    private class StoredMessage implements RunnableTest {

        @Getter
        private MessageContainer msgc;

        @NonNull
        private Stores stores;

        @NonNull
        private String messageId;

        public void test() throws Exception {
            msgc = stores.getMessageContainer(messageId);

            assertNotNull(msgc);
            assertNotNull(msgc.getMessage());
            assertThat(msgc.getMessage().getChannelId(), CoreMatchers.not(emptyOrNullString()));
        }
    }

    @Test
    @Order(2)
    void canSendMessageAsync() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(UUID.randomUUID().toString())
                .setSource("facebook")
                .setSourceChannelId("aysnc-id")
                .setToken("AYSNC_TOKEN")
                .build();

        final String messagePayload = "{\"text\":\"Async message\"}";
        final String requestPayload = String.format("{\"conversation_id\":\"%s\"," +
                        "\"message\":%s}",
                conversationId, messagePayload);

        final String response = webTestHelper.post("/messages.send", requestPayload)
                .andExpect(status().isAccepted())
                .andReturn().getResponse().getContentAsString();

        final JsonNode responseNode = new ObjectMapper().readTree(response);
        final String messageId = responseNode.get("id").textValue();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));
        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, 1));

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                                "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk()),
                "Could not find conversation"
        );

        StoredMessage sm = new StoredMessage(stores, messageId);
        retryOnException(sm, "Message was not updated");

        Message msg = sm.getMsgc().getMessage();
        assertThat(msg.getConversationId(), equalTo(conversationId));
        assertThat(msg.getChannelId(), equalTo(channel.getId()));
        assertThat(msg.getSource(), equalTo(channel.getSource()));
    }
}
