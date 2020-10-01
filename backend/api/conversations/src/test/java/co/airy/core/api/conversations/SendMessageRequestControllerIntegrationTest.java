package co.airy.core.api.conversations;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SendMessageRequest;
import co.airy.core.api.conversations.util.ConversationGenerator;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceFacebookSendMessageRequests;
import co.airy.kafka.schema.source.SourceGoogleSendMessageRequests;
import co.airy.kafka.schema.source.SourceTwilioSendMessageRequests;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
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
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static co.airy.core.api.conversations.util.ConversationGenerator.getConversationRecords;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100",
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class SendMessageRequestControllerIntegrationTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static TestHelper testHelper;
    private static String facebookConversationId = "facebook-conversation-id";
    private static String googleConversationId = "google-conversation-id";
    private static String twilioConversationId = "twilio-conversation-id";
    private static String selfConversationId = "self-conversation-id";
    private static final SourceFacebookSendMessageRequests sourceFacebookSendMessageRequests = new SourceFacebookSendMessageRequests();
    private static final SourceGoogleSendMessageRequests sourceGoogleSendMessageRequests = new SourceGoogleSendMessageRequests();
    private static final SourceTwilioSendMessageRequests sourceTwilioSendMessageRequests = new SourceTwilioSendMessageRequests();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static boolean testDataInitialized = false;
    final Channel facebookChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("facebook-channel-id")
            .setName("channel-name")
            .setSource("FACEBOOK")
            .setSourceChannelId("ps-id")
            .build();
    final Channel googleChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("google-channel-id")
            .setName("channel-name")
            .setSource("GOOGLE")
            .setSourceChannelId("ps-id")
            .build();
    final Channel twilioChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("twilio-channel-id")
            .setName("channel-name")
            .setSource("SMS_TWILIO")
            .setSourceChannelId("ps-id")
            .build();
    final Channel selfChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("self-channel-id")
            .setName("channel-name")
            .setSource("SELF")
            .setSourceChannelId("ps-id")
            .build();
    private final List<ConversationGenerator.CreateConversation> conversations = List.of(
            ConversationGenerator.CreateConversation.builder()
                    .conversationId(facebookConversationId)
                    .lastOffset(1L)
                    .channel(facebookChannel)
                    .build(),
            ConversationGenerator.CreateConversation.builder()
                    .conversationId(googleConversationId)
                    .lastOffset(1L)
                    .channel(googleChannel)
                    .build(),
            ConversationGenerator.CreateConversation.builder()
                    .conversationId(twilioConversationId)
                    .lastOffset(1L)
                    .channel(twilioChannel)
                    .build(),
            ConversationGenerator.CreateConversation.builder()
                    .conversationId(selfConversationId)
                    .lastOffset(1L)
                    .channel(selfChannel)
                    .build()
    );
    @Autowired
    private MockMvc mvc;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                applicationCommunicationMetadata,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                sourceFacebookSendMessageRequests,
                sourceGoogleSendMessageRequests,
                sourceTwilioSendMessageRequests
        );

        testHelper.beforeAll();
    }
    @BeforeEach
    void init() throws Exception {
        if (testDataInitialized) {
            return;
        }

        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), facebookChannel.getId(), facebookChannel));
        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), googleChannel.getId(), googleChannel));
        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), twilioChannel.getId(), twilioChannel));
        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), selfChannel.getId(), selfChannel));

        testHelper.produceRecords(getConversationRecords(conversations));

        testHelper.waitForCondition(
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy"
        );

        testDataInitialized = true;
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @Test
    void dispatchesCorrectly() throws Exception {
        testHelper.waitForCondition(
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy"
        );

        String facebookPayload = "{\"conversation_id\": \"" + facebookConversationId + "\", \"text\": \"answer is 42\"}";
        String googlePayload = "{\"conversation_id\": \"" + googleConversationId + "\", \"text\": \"This is better than yelp.\"}";
        String twilioPayload = "{\"conversation_id\": \"" + twilioConversationId + "\", \"text\": \"We are just a sparkling twilio.\"}";
        String selfPayload = "{\"conversation_id\": \"" + selfConversationId + "\", \"text\": \"I'm gonna get myself, I'm gonna get myself, I'm gonna get myself connected, I ain't gonna go blind, For the light which is reflected\"}";

        testHelper.waitForCondition(() ->
                        mvc.perform(post("/send-message")
                                .headers(buildHeaders())
                                .content(facebookPayload))
                                .andExpect(status().isOk()),
                "Facebook Message was not sent"
        );

        testHelper.waitForCondition(() ->
                        mvc.perform(post("/send-message")
                                .headers(buildHeaders())
                                .content(googlePayload))
                                .andExpect(status().isOk()),
                "Google was not sent"
        );

        testHelper.waitForCondition(() ->
                        mvc.perform(post("/send-message")
                                .headers(buildHeaders())
                                .content(twilioPayload))
                                .andExpect(status().isOk()),
                "Twilio message was not sent"
        );

        testHelper.waitForCondition(() ->
                        mvc.perform(post("/send-message")
                                .headers(buildHeaders())
                                .content(selfPayload))
                                .andExpect(status().isOk()),
                "Self Message was not sent"
        );

        List<ConsumerRecord<String, SendMessageRequest>> records = testHelper.consumeRecords(1, sourceFacebookSendMessageRequests.name());
        assertThat(records, hasSize(1));

        List<ConsumerRecord<String, SendMessageRequest>> twilioRecords = testHelper.consumeRecords(1, sourceTwilioSendMessageRequests.name());
        assertThat(twilioRecords, hasSize(1));

        List<ConsumerRecord<String, Message>> selfRecord = testHelper.consumeRecords(1, applicationCommunicationMessages.name());
        assertThat(selfRecord, hasSize(1));
        assertThat(selfRecord.get(0).value().getContent(), equalTo("I'm gonna get myself, I'm gonna get myself, I'm gonna get myself connected, I ain't gonna go blind, For the light which is reflected"));
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }

}
