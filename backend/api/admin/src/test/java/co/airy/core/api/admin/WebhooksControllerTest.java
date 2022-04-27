package co.airy.core.api.admin;

import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.api.admin.util.Topics;
import co.airy.core.api.config.ServiceDiscovery;
import co.airy.core.api.config.dto.ServiceInfo;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.event.payload.EventType;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class WebhooksControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    @InjectMocks
    private WebhooksController webhooksController;

    @MockBean
    private ServiceDiscovery serviceDiscovery;

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
        MockitoAnnotations.openMocks(this);
        webTestHelper.waitUntilHealthy();
    }

    @Test
    public void canManageWebhook() throws Exception {
        final String webhookId = UUID.randomUUID().toString();
        final String infoPayload = String.format("{\"id\":\"%s\"}", webhookId);
        webTestHelper.post("/webhooks.info", infoPayload).andExpect(status().isNotFound());

        final String url = "http://example.org/webhook";
        final String name = "webhook name";
        final String xAuthHeader = "auth token";
        final EventType subscribeEvent = EventType.MESSAGE_CREATED;
        final EventType newSubscribeEvent = EventType.MESSAGE_UPDATED;

        final String subscribePayload = String.format("{\"id\":\"%s\",\"name\":\"%s\",\"url\":\"%s\",\"headers\":{\"X-Auth\":\"%s\"},\"events\":[\"%s\"]}",
                webhookId, name, url, xAuthHeader, subscribeEvent.getEventType());

        final String updatePayload = String.format("{\"id\":\"%s\",\"name\":\"%s\",\"url\":\"%s\",\"headers\":{\"X-Auth\":\"%s\"},\"events\":[\"%s\", \"%s\"]}",
                webhookId, name, url, xAuthHeader, subscribeEvent.getEventType(), newSubscribeEvent.getEventType());

        when(serviceDiscovery.getComponent(Mockito.anyString())).thenCallRealMethod();

        // One service of the component is failing
        doReturn(Map.of(
                "webhook-consumer", new ServiceInfo(true, false, "integration-webhook"),
                "webhook-publisher", new ServiceInfo(true, true, "integration-webhook")
        )).when(serviceDiscovery).getServices();

        webTestHelper.post("/webhooks.subscribe", subscribePayload)
                .andExpect(status().isConflict());

        // Component is healthy
        doReturn(Map.of(
                "webhook-consumer", new ServiceInfo(true, true, "integration-webhook"),
                "webhook-publisher", new ServiceInfo(true, true, "integration-webhook")
        )).when(serviceDiscovery).getServices();

        webTestHelper.post("/webhooks.subscribe", subscribePayload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(webhookId)))
                .andExpect(jsonPath("$.name", equalTo(name)))
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)));

        retryOnException(() -> webTestHelper.post("/webhooks.update", updatePayload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", equalTo(webhookId)))
                        .andExpect(jsonPath("$.name", equalTo(name)))
                        .andExpect(jsonPath("$.url", equalTo(url)))
                        .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                        .andExpect(jsonPath("$.events", hasSize(2))),
                "Webhook was not stored to update"
        );

        retryOnException(() -> webTestHelper.post("/webhooks.info", infoPayload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", equalTo(webhookId)))
                        .andExpect(jsonPath("$.name", equalTo(name)))
                        .andExpect(jsonPath("$.url", equalTo(url)))
                        .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader))),
                "Webhook was not stored"
        );

        webTestHelper.post("/webhooks.unsubscribe", infoPayload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)));
    }

    @Test
    public void canListWebhooks() throws Exception {
        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(Topics.applicationCommunicationWebhooks.name(), UUID.randomUUID().toString(),
                        Webhook.newBuilder()
                                .setEndpoint("http://endpoint.com/webhook")
                                .setId(UUID.randomUUID().toString())
                                .setStatus(Status.Subscribed)
                                .setSubscribedAt(Instant.now().toEpochMilli())
                                .build()
                ),
                new ProducerRecord<>(Topics.applicationCommunicationWebhooks.name(), UUID.randomUUID().toString(),
                        Webhook.newBuilder()
                                .setEndpoint("http://endpoint.com/webhook-2")
                                .setId(UUID.randomUUID().toString())
                                .setStatus(Status.Subscribed)
                                .setSubscribedAt(Instant.now().toEpochMilli())
                                .build()
                ),
                new ProducerRecord<>(Topics.applicationCommunicationWebhooks.name(), UUID.randomUUID().toString(),
                        Webhook.newBuilder()
                                .setEndpoint("http://endpoint.com/webhook-2")
                                .setId(UUID.randomUUID().toString())
                                .setStatus(Status.Unsubscribed)
                                .setSubscribedAt(Instant.now().toEpochMilli())
                                .build()
                )
        ));

        retryOnException(() -> webTestHelper.post("/webhooks.list")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(lessThanOrEqualTo(2)))),
                "list did not return all results"
        );
    }

}
