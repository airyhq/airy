package co.airy.co.api.send_message;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Contact;
import co.airy.avro.communication.Conversation;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SendMessageRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationContacts;
import co.airy.kafka.schema.application.ApplicationCommunicationConversations;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.util.AssertionErrors.assertEquals;
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
    private static String conversationId = "facebook-conversation-id";
    private static String googleConversationId = "google-conversation-id";
    private static String twilioConversationId = "twilio-conversation-id";
    private static String selfConversationId = "self-conversation-id";
    private static SourceFacebookSendMessageRequests sourceFacebookSendMessageRequests = new SourceFacebookSendMessageRequests();
    private static SourceGoogleSendMessageRequests sourceGoogleSendMessageRequests = new SourceGoogleSendMessageRequests();
    private static SourceTwilioSendMessageRequests sourceTwilioSendMessageRequests = new SourceTwilioSendMessageRequests();
    private static ApplicationCommunicationConversations applicationCommunicationConversations = new ApplicationCommunicationConversations();
    private static ApplicationCommunicationContacts applicationCommunicationContacts = new ApplicationCommunicationContacts();
    private static ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    @Autowired
    private MockMvc mvc;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                applicationCommunicationConversations,
                applicationCommunicationChannels,
                applicationCommunicationContacts,
                applicationCommunicationMessages,
                sourceFacebookSendMessageRequests,
                sourceGoogleSendMessageRequests,
                sourceTwilioSendMessageRequests
        );

        testHelper.beforeAll();

        final String facebookChannelId = "channel id";
        final String googleChannelId = "google channel id";
        final String twilioChannelId = "twilio channel id";
        final String selfChannelId = "self channel id";

        testHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), selfChannelId, Channel.newBuilder()
                        .setId(selfChannelId)
                        .setSourceChannelId("ps-1")
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .setName("widget")
                        .setSource("SELF")
                        .setToken("some-token")
                        .build()),
                new ProducerRecord<>(applicationCommunicationConversations.name(), selfConversationId, Conversation.newBuilder()
                        .setId(selfConversationId)
                        .setLocale(null)
                        .setSourceContactId("yo")
                        .setCreatedAt(1)
                        .setChannelId(selfChannelId)
                        .build()),
                new ProducerRecord<>(applicationCommunicationContacts.name(), selfConversationId, Contact.newBuilder()
                        .setId(selfConversationId)
                        .setSourceLocale(null)
                        .setAvatarUrl("avatar-1")
                        .setCreatedAt(1)
                        .setFirstName("Anonymous")
                        .setLastName("Anonymous")
                        .setSourceContactId("yo")
                        .build()),
                new ProducerRecord<>(applicationCommunicationChannels.name(), facebookChannelId, Channel.newBuilder()
                        .setId(facebookChannelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .setSourceChannelId("ps-2")
                        .setName("fb-page")
                        .setSource("FACEBOOK")
                        .setToken("some-token")
                        .build()),
                new ProducerRecord<>(applicationCommunicationConversations.name(), conversationId, Conversation.newBuilder()
                        .setId(conversationId)
                        .setLocale(null)
                        .setSourceContactId("yo")
                        .setCreatedAt(1)
                        .setChannelId(facebookChannelId)
                        .build()),
                new ProducerRecord<>(applicationCommunicationContacts.name(), conversationId, Contact.newBuilder()
                        .setId(conversationId)
                        .setSourceLocale(null)
                        .setAvatarUrl("avatar-1")
                        .setCreatedAt(1)
                        .setFirstName("Anonymous")
                        .setLastName("Anonymous")
                        .setSourceContactId("yo")
                        .build()),
                new ProducerRecord<>(applicationCommunicationChannels.name(), googleChannelId, Channel.newBuilder()
                        .setId(googleChannelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .setSourceChannelId("ps-3")
                        .setName("google location")
                        .setSource("GOOGLE")
                        .setToken("some google token")
                        .build()),
                new ProducerRecord<>(applicationCommunicationChannels.name(), twilioChannelId, Channel.newBuilder()
                        .setId(twilioChannelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .setSourceChannelId("ps-4")
                        .setName("What would be the name?")
                        .setSource("SMS_TWILIO")
                        .setToken("")
                        .build()),
                new ProducerRecord<>(applicationCommunicationConversations.name(), twilioConversationId, Conversation.newBuilder()
                        .setId(twilioConversationId)
                        .setLocale(null)
                        .setSourceContactId("+4938743874834")
                        .setCreatedAt(1)
                        .setChannelId(twilioChannelId)
                        .build()),
                new ProducerRecord<>(applicationCommunicationContacts.name(), twilioConversationId, Contact.newBuilder()
                        .setId(twilioConversationId)
                        .setSourceLocale(null)
                        .setAvatarUrl("avatar-1")
                        .setCreatedAt(1)
                        .setFirstName("Anonymous")
                        .setLastName("Anonymous")
                        .setSourceContactId("yo")
                        .build()),
                new ProducerRecord<>(applicationCommunicationConversations.name(), googleConversationId, Conversation.newBuilder()
                        .setId(googleConversationId)
                        .setLocale(null)
                        .setCreatedAt(1)
                        .setChannelId(googleChannelId)
                        .setSourceContactId("yo")
                        .build()),
                new ProducerRecord<>(applicationCommunicationContacts.name(), googleConversationId, Contact.newBuilder()
                        .setId(googleConversationId)
                        .setSourceLocale(null)
                        .setAvatarUrl("avatar-1")
                        .setCreatedAt(1)
                        .setFirstName("Anonymous")
                        .setLastName("Anonymous")
                        .setSourceContactId("yo")
                        .build())
        ));
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

        String facebookPayload = "{\"conversation_id\": \"" + conversationId + "\", \"text\": \"answer is 42\"}";
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

        assertEquals("contact is not the same", records.get(0).value().getContact().getId(), conversationId);
        List<ConsumerRecord<String, SendMessageRequest>> googleRecords = testHelper.consumeRecords(1, sourceGoogleSendMessageRequests.name());
        assertThat(googleRecords, hasSize(1));

//        List<ConsumerRecord<String, SendMessageRequest>> twilioRecords = testHelper.consumeRecords(1, sourceTwilioSendMessageRequests.name());
//        assertThat(twilioRecords, hasSize(1));

//        List<ConsumerRecord<String, Message>> selfRecord = testHelper.consumeRecords(1, applicationCommunicationMessages.name());
//        assertThat(selfRecord, hasSize(1));
//        assertThat(selfRecord.get(0).value().getContent(), equalTo("I'm gonna get myself, I'm gonna get myself, I'm gonna get myself connected, I ain't gonna go blind, For the light which is reflected"));
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }

}
