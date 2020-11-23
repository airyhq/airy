package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
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

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class ConversationsTagTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationReadReceipts applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata,
                applicationCommunicationReadReceipts
        );

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
    void canTagAndUntagConversations() throws Exception {
        final String userId = "user-id";
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId("channel-id")
                .setName("channel-name")
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));

        final String conversationId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, 1));

        retryOnException(() -> webTestHelper.post("/conversations.info",
                "{\"conversation_id\":\"" + conversationId + "\"}", userId)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(conversationId))), "Conversation was not created");

        final String tagId = UUID.randomUUID().toString();

        webTestHelper.post("/conversations.tag",
                "{\"conversation_id\":\"" + conversationId + "\",\"tag_id\":\"" + tagId + "\"}", userId)
                .andExpect(status().isAccepted());

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}", userId)
                        .andExpect(status().isOk())
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath("$.tags", containsInAnyOrder(tagId))),
                "Conversation was not tagged");

        webTestHelper.post("/conversations.untag",
                "{\"conversation_id\":\"" + conversationId + "\",\"tag_id\":\"" + tagId + "\"}", userId)
                .andExpect(status().isAccepted());

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}", userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath("$.tags.length()", is(0))),
                "Conversation was not untagged");
    }

    @Test
    public void canHandleAnEmptyPayload() throws Exception {
        webTestHelper.post("/conversations.tag", "{}", "user-id")
                .andExpect(status().isBadRequest());
    }
}
