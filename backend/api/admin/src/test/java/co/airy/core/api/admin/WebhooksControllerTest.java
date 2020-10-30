package co.airy.core.api.admin;

import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.junit.jupiter.api.AfterAll;
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

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class WebhooksControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationTags applicationCommunicationTags = new ApplicationCommunicationTags();

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationWebhooks,
                applicationCommunicationTags
        );
        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        testHelper.waitForCondition(
                () -> webTestHelper.get("/actuator/health").andExpect(status().isOk()),
                "Application is not healthy");
    }

    @Test
    public void canManageWebhook() throws Exception {
        webTestHelper.post("/webhooks.info", "{}", "user-id").andExpect(status().isNotFound());

        final String url = "http://example.org/webhook";
        final String xAuthHeader = "auth token";

        final String payload = "{\"url\":\"" + url + "\",\"headers\":{\"X-Auth\":\"" + xAuthHeader + "\"}}";

        webTestHelper.post("/webhooks.subscribe", payload, "user-id")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                .andExpect(jsonPath("$.api_secret", is(not(nullValue()))));

        testHelper.waitForCondition(() -> webTestHelper.post("/webhooks.info", "{}", "user-id")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.url", equalTo(url)))
                        .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                        .andExpect(jsonPath("$.api_secret", is(not(nullValue())))),
                "Webhook was not stored"
        );

        webTestHelper.post("/webhooks.unsubscribe", payload, "user-id")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                .andExpect(jsonPath("$.api_secret", is(not(nullValue()))));

        //TODO add assertion?
    }

}
