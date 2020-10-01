package co.airy.core.sources.facebook;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.SendMessageRequest;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.facebook.model.SendMessagePayload;
import co.airy.core.sources.facebook.services.Api;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.schema.source.SourceFacebookSendMessageRequests;
import co.airy.kafka.schema.source.SourceFacebookTransformedEvents;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;

@SpringBootTest(properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100",
        "facebook.app-id=12345"
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
class SendMessageTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;

    private static final Topic sourceFacebookEvents = new SourceFacebookEvents();
    private static final Topic sourceFacebookTransformedEvents = new SourceFacebookTransformedEvents();
    private static final Topic sourceFacebookSendMessageRequests = new SourceFacebookSendMessageRequests();
    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();

    @MockBean
    private Api api;

    @Autowired
    @InjectMocks
    private EventsRouter worker;


    private static boolean streamInitialized = false;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                sourceFacebookEvents,
                sourceFacebookSendMessageRequests,
                sourceFacebookTransformedEvents,
                applicationCommunicationChannels,
                applicationCommunicationMessages
        );

        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.initMocks(this);

        if (!streamInitialized) {

            testHelper.waitForCondition(() -> assertEquals(worker.getStreamState(), RUNNING), "Failed to reach RUNNING state.");

            streamInitialized = true;
        }
    }

    @Test
    void callsTheFacebookApi() throws Exception {
        final String conversationId = "conversationId";
        final String messageId = "message-id";
        final String sourceConversationId = "source-conversation-id";
        final String token = "token";
        final String text = "Hello World";

        ArgumentCaptor<SendMessagePayload> payloadCaptor = ArgumentCaptor.forClass(SendMessagePayload.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        doNothing().when(api).sendMessage(tokenCaptor.capture(), payloadCaptor.capture());

        testHelper.produceRecord(new ProducerRecord<>(sourceFacebookSendMessageRequests.name(), conversationId,
                SendMessageRequest.newBuilder()
                        .setCreatedAt(Instant.now().toEpochMilli())
                        .setMessage(Message.newBuilder()
                                .setId(messageId)
                                .setOffset(0L)
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId(sourceConversationId)
                                .setSenderType(SenderType.APP_USER)
                                .setConversationId(conversationId)
                                .setHeaders(Map.of("SOURCE", "facebook"))
                                .setChannelId("channel-id")
                                .setContent("{\"text\":\"" + text + "\"}")
                                .build())
                        .setSourceConversationId(sourceConversationId)
                        .setToken(token)
                        .build()
        ));


        List<Message> messages = testHelper.consumeValues(1, applicationCommunicationMessages.name());

        assertThat(messages, hasSize(1));

        final Message message = messages.get(0);

        assertThat(message.getId(), equalTo(messageId));
        assertThat(message.getConversationId(), equalTo(conversationId));

        final SendMessagePayload sendMessagePayload = payloadCaptor.getValue();

        assertThat(sendMessagePayload.getRecipient().getId(), equalTo(sourceConversationId));
        assertThat(sendMessagePayload.getMessage().getText(), equalTo(text));

        assertThat(tokenCaptor.getValue(), equalTo(token));

    }
}
