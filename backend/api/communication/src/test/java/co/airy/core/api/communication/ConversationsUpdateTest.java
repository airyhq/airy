package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.communication.util.TestConversation;
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

import java.util.UUID;

import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class ConversationsUpdateTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final Channel channel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .build();
    private static final String conversationId = UUID.randomUUID().toString();

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
    void canSetAndRemoveStateFromConversations() throws Exception {
        retryOnException(() -> webTestHelper.post("/conversations.info",
                "{\"conversation_id\":\"" + conversationId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(conversationId))), "conversation was not created");

        final String state = "open";

        webTestHelper.post("/conversations.set-state",
                "{\"conversation_id\":\"" + conversationId + "\",\"state\":\"" + state + "\"}")
                .andExpect(status().isNoContent());

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath("$.metadata.state", is(state))),
                "conversation state was not set");

        webTestHelper.post("/conversations.remove-state",
                "{\"conversation_id\":\"" + conversationId + "\"}")
                .andExpect(status().isNoContent());

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath("$.metadata.state").doesNotExist()),
                "conversation state was not removed");
    }

    @Test
    void canUpdateDisplayName() throws Exception {
        final String desiredDisplayName = "Grace Hopper";
        retryOnException(() -> webTestHelper.post("/conversations.info",
                "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath("$.metadata.contact.display_name", is(not(desiredDisplayName)))),
                "conversation was not created");

        webTestHelper.post("/conversations.update-contact",
                "{\"conversation_id\":\"" + conversationId + "\",\"display_name\":\"" + desiredDisplayName + "\"}")
                .andExpect(status().isNoContent());

        retryOnException(() -> webTestHelper.post("/conversations.info",
                "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.metadata.contact.display_name", is(desiredDisplayName))),
                "conversation was not updated");
    }
}
