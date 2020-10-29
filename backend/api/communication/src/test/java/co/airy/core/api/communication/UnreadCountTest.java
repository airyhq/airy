package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.communication.util.ConversationGenerator;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.auth.Jwt;
import co.airy.spring.core.AirySpringBootApplication;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static co.airy.core.api.communication.util.ConversationGenerator.getConversationRecords;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class UnreadCountTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static TestHelper testHelper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private Jwt jwt;

    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationReadReceipts applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts();

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata,
                applicationCommunicationReadReceipts
        );

        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @BeforeEach
    void init() throws Exception {
        testHelper.waitForCondition(
                () -> mvc.perform(get("/actuator/health")).andExpect(status().isOk()),
                "Application is not healthy");
    }

    @Test
    void shouldResetTheUnreadCount() throws Exception {
        final String userId = "user-id";
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId("channel-id")
                .setName("channel-name")
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build();

        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));

        final String conversationId = UUID.randomUUID().toString();

        final Integer unreadMessages = 3;

        testHelper.produceRecords(getConversationRecords(
                ConversationGenerator.CreateConversation.builder()
                        .channel(channel)
                        .messageCount(unreadMessages.longValue())
                        .conversationId(conversationId)
                        .build()
        ));

        final String conversationByIdRequest = "{\"conversation_id\":\"" + conversationId + "\"}";

        testHelper.waitForCondition(
                () -> mvc.perform(post("/conversations.info")
                        .headers(buildHeaders(userId))
                        .content(conversationByIdRequest))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.unread_message_count", equalTo(unreadMessages))),
                "Conversation list not showing unread count"
        );

        mvc.perform(post("/conversations.read")
                .headers(buildHeaders(userId))
                .content(conversationByIdRequest))
                .andExpect(status().isAccepted());

        testHelper.waitForCondition(
                () -> mvc.perform(post("/conversations.info")
                        .headers(buildHeaders(userId))
                        .content(conversationByIdRequest))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.unread_message_count", equalTo(0))),
                "Conversation unread count did not reset");
    }

    private HttpHeaders buildHeaders(final String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, jwt.tokenFor(userId));
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }
}
