package co.airy.core.sources.api;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.sources.api.util.TestSource;
import co.airy.core.sources.api.util.Topics;
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
import org.springframework.http.HttpMethod;
import org.springframework.mock.http.client.MockClientHttpRequest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.security.InvalidKeyException;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.crypto.Signature.CONTENT_SIGNATURE_HEADER;
import static co.airy.crypto.Signature.getSignature;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest(properties = {
        "systemToken=user-generated-api-token",
        "jwtSecret=long-randomly-generated-secret-used-as-jwt-secret-key",
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class SendMessageTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private TestSource testSource;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    private static KafkaTestHelper kafkaTestHelper;

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
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    void canSendMessage() throws Exception {
        // Create source
        final String actionEndpoint = "http://customer-endpoint.com/webhook";
        final String sourceId = "my-source";
        final String token = testSource.createSourceAndGetToken(sourceId, actionEndpoint);
        final String messageId = UUID.randomUUID().toString();

        final String sourceConversationId = "source-conversation-id";
        // Create conversation
        kafkaTestHelper.produceRecord(
                new ProducerRecord<>(Topics.applicationCommunicationMessages.name(), "other-message-id",
                        Message.newBuilder()
                                .setId("other-message-id")
                                .setSource(sourceId)
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId(sourceConversationId)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId("conversationId")
                                .setChannelId("channelId")
                                .setContent("Hi")
                                .setIsFromContact(true)
                                .build())
        );

        mockServer.expect(once(), requestTo(new URI(actionEndpoint)))
                .andExpect(method(HttpMethod.POST))
                .andExpect((request) -> {
                    MockClientHttpRequest mockRequest = (MockClientHttpRequest) request;
                    final String expectedSignature = mustGetSignature(token, mockRequest.getBodyAsString());
                    assertThat(mockRequest.getHeaders().get(CONTENT_SIGNATURE_HEADER).get(0), equalTo(expectedSignature));
                })
                .andRespond(withSuccess());
        
        kafkaTestHelper.produceRecord(new ProducerRecord<>(Topics.applicationCommunicationMessages.name(), messageId,
                Message.newBuilder()
                        .setId(messageId)
                        .setSource(sourceId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId(sourceConversationId)
                        .setDeliveryState(DeliveryState.PENDING)
                        .setConversationId("conversationId")
                        .setChannelId("channelId")
                        .setContent("Hi")
                        .setIsFromContact(false)
                        .build()));

        retryOnException(() -> mockServer.verify(), "Endpoint was not called", 10_000);
    }

    private String mustGetSignature(String key, String content) {
        try {
            return getSignature(key, content);
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }
}
