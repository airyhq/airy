package co.airy.core.webhook.consumer;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.webhook.WebhookEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.event.payload.MessageCreated;
import co.airy.spring.core.AirySpringBootApplication;
import com.dinstone.beanstalkc.Job;
import com.dinstone.beanstalkc.JobConsumer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import static co.airy.core.webhook.consumer.Sender.CONTENT_SIGNATURE_HEADER;
import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class ConsumerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, applicationCommunicationWebhooks);
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Autowired
    Stores stores;

    @Autowired
    Signature signature;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    RestTemplate restTemplate;

    @MockBean
    private JobConsumer beanstalkConsumer;

    private MockRestServiceServer mockServer;

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.openMocks(this);
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    void canSendOutEvents() throws Exception {
        final String signKey = "user-defined-hmac-key";
        final String endpoint = "http://customer-endpoint.com/webhook";
        final Webhook webhook = Webhook.newBuilder()
                .setEndpoint(endpoint)
                .setHeaders(Map.of(
                        "user-defined", "header"
                ))
                .setId(UUID.randomUUID().toString())
                .setStatus(Status.Subscribed)
                .setSignKey(signKey)
                .build();

        final WebhookEvent event = getTestEvent(webhook.getId());
        final String content = objectMapper.writeValueAsString(event.getPayload());

        mockServer.expect(once(), requestTo(new URI(endpoint)))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("user-defined", equalTo("header")))
                .andExpect(header(CONTENT_SIGNATURE_HEADER, equalTo(signature.getSignature(signKey, content))))
                .andRespond(withSuccess());

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationWebhooks.name(), webhook.getId(), webhook));

        retryOnException(() -> assertThat(stores.getWebhook(webhook.getId()), is(not(nullValue()))), "Webhook store did not get ready");

        final byte[] bytes = objectMapper.writeValueAsBytes(event);
        final Job job = new Job();
        job.setId(1);
        job.setData(bytes);
        when(beanstalkConsumer.reserveJob(Mockito.anyLong())).thenReturn(job);

        retryOnException(() -> mockServer.verify(), "Endpoint was not called", 10_000);
    }

    private WebhookEvent getTestEvent(String webhookId) {
        final Message message = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(UUID.randomUUID().toString())
                .setContent("{\"text\":\"Hello world\"}")
                .setConversationId(UUID.randomUUID().toString())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource("source")
                .setSenderId(UUID.randomUUID().toString())
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();

        return WebhookEvent.builder()
                .webhookId(webhookId)
                .payload(MessageCreated.fromMessage(message)).build();
    }
}
