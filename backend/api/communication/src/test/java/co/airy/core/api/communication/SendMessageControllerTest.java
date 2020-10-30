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
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
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

import java.util.List;
import java.util.Optional;

import static co.airy.core.api.communication.util.ConversationGenerator.getConversationRecords;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.jupiter.api.Assertions.fail;
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
    private WebTestHelper webTestHelper;

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
                () -> webTestHelper.get("/actuator/health").andExpect(status().isOk()),
                "Application is not healthy");

        testDataInitialized = true;
    }

    @Test
    void canSendMessages() throws Exception {
        String payload = "{\"conversation_id\": \"" + facebookConversationId + "\", \"message\": { \"text\": \"answer is 42\" }}";
        final String userId = "user-id";

        testHelper.waitForCondition(() ->
                        webTestHelper.post("/messages.send", payload, userId).andExpect(status().isOk()),
                "Facebook Message was not sent");

        List<ConsumerRecord<String, Message>> records = testHelper.consumeRecords(2, applicationCommunicationMessages.name());
        assertThat(records, hasSize(2));

        final Optional<Message> maybeMessage = records.stream()
                .map(ConsumerRecord::value)
                .filter(m -> m.getSenderType().equals(SenderType.APP_USER))
                .findFirst();

        if (maybeMessage.isEmpty()) {
            fail("message not present");
        }

        final Message message = maybeMessage.get();
        assertThat(message.getContent(), is("{\"text\":\"answer is 42\"}"));
        assertThat(message.getSenderId(), is(userId));
    }
}
