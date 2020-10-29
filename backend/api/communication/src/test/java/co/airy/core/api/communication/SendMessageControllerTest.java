package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.communication.util.ConversationGenerator;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.auth.Jwt;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.consumer.ConsumerRecord;
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

import java.util.List;

import static co.airy.core.api.communication.util.ConversationGenerator.getConversationRecords;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class SendMessageControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;
    private static final String facebookConversationId = "facebook-conversation-id";
    private static boolean testDataInitialized = false;

    final Channel facebookChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("facebook-channel-id")
            .setName("channel-name")
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .setToken("AWESOME TOKEN")
            .build();

    private final List<ConversationGenerator.CreateConversation> conversations = List.of(
            ConversationGenerator.CreateConversation.builder()
                    .conversationId(facebookConversationId)
                    .messageCount(1L)
                    .channel(facebookChannel)
                    .build());

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
        if (testDataInitialized) {
            return;
        }

        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), facebookChannel.getId(), facebookChannel));
        testHelper.produceRecords(getConversationRecords(conversations));

        testHelper.waitForCondition(
                () -> mvc.perform(get("/actuator/health")).andExpect(status().isOk()),
                "Application is not healthy");

        testDataInitialized = true;
    }

    @Test
    void dispatchesCorrectly() throws Exception {
        testHelper.waitForCondition(
                () -> mvc.perform(get("/actuator/health")).andExpect(status().isOk()),
                "Application is not healthy");

        String facebookPayload = "{\"conversation_id\": \"" + facebookConversationId + "\", \"message\": { \"text\": \"answer is 42\" }}";
        final String userId = "user-id";

        testHelper.waitForCondition(() ->
                        mvc.perform(post("/messages.send")
                                .headers(buildHeaders(userId))
                                .content(facebookPayload))
                                .andExpect(status().isOk()),
                "Facebook Message was not sent");

        List<ConsumerRecord<String, Message>> records = testHelper.consumeRecords(2, applicationCommunicationMessages.name());
        assertThat(records, hasSize(2));

        final Message message = records.stream()
                .map(ConsumerRecord::value)
                .filter(m -> m.getSenderType().equals(SenderType.APP_USER))
                .findFirst()
                .orElse(null);
        assertThat(message.getContent(), is("{\"text\":\"answer is 42\"}"));
        assertThat(message.getSenderId(), is(userId));
    }

    private HttpHeaders buildHeaders(String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        headers.add(HttpHeaders.AUTHORIZATION, jwt.tokenFor(userId));
        return headers;
    }
}
