package co.airy.core.api.admin;

import co.airy.core.api.config.ServiceDiscovery;
import co.airy.core.api.config.dto.ComponentInfo;
import co.airy.core.api.config.dto.ServiceInfo;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationTemplates;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Map;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.equalTo;
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

    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationTags applicationCommunicationTags = new ApplicationCommunicationTags();
    private static final ApplicationCommunicationTemplates applicationCommunicationTemplates = new ApplicationCommunicationTemplates();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationWebhooks,
                applicationCommunicationMetadata,
                applicationCommunicationTags,
                applicationCommunicationTemplates
        );
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
        webTestHelper.post("/webhooks.info", "{}").andExpect(status().isNotFound());

        final String url = "http://example.org/webhook";
        final String xAuthHeader = "auth token";

        final String payload = "{\"url\":\"" + url + "\",\"headers\":{\"X-Auth\":\"" + xAuthHeader + "\"}}";

        when(serviceDiscovery.getComponent(Mockito.anyString())).thenCallRealMethod();
        // One service of the component is failing
        doReturn(Map.of(
                "webhook-consumer", new ServiceInfo(true, false, "integration-webhook"),
                "webhook-publisher", new ServiceInfo(true, true, "integration-webhook")
        )).when(serviceDiscovery).getServices();

        webTestHelper.post("/webhooks.subscribe", payload)
                .andExpect(status().isConflict());

        // Component is healthy
        doReturn(Map.of(
                "webhook-consumer", new ServiceInfo(true, true, "integration-webhook"),
                "webhook-publisher", new ServiceInfo(true, true, "integration-webhook")
        )).when(serviceDiscovery).getServices();

        webTestHelper.post("/webhooks.subscribe", payload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)));

        retryOnException(() -> webTestHelper.post("/webhooks.info", "{}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.url", equalTo(url)))
                        .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader))),
                "Webhook was not stored"
        );

        webTestHelper.post("/webhooks.unsubscribe", payload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)));
    }

}
