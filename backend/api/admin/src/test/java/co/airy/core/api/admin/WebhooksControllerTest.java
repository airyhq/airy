package co.airy.core.api.admin;

import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.auth.Jwt;
import co.airy.spring.core.AirySpringBootApplication;
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

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    private MockMvc mvc;

    @Autowired
    private Jwt jwt;

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
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy");
    }


    @Test
    public void createAndUnsubscribeWebhook() throws Exception {
        mvc.perform(post("/webhooks.info")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString())
                .header(HttpHeaders.AUTHORIZATION, jwt.tokenFor("user-id")))
                .andExpect(status().isNotFound());

        final String url = "http://example.org/webhook";
        final String xAuthHeader = "auth token";

        final String requestContent = "{\"url\":\"" + url + "\",\"headers\":{\"X-Auth\":\"" + xAuthHeader + "\"}}";

        mvc.perform(post("/webhooks.subscribe")
                .content(requestContent)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString())
                .header(HttpHeaders.AUTHORIZATION, jwt.tokenFor("user-id")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                .andExpect(jsonPath("$.api_secret", is(not(nullValue()))));

        testHelper.waitForCondition(() -> mvc.perform(post("/webhooks.info")
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString())
                        .header(HttpHeaders.AUTHORIZATION, jwt.tokenFor("user-id")))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.url", equalTo(url)))
                        .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                        .andExpect(jsonPath("$.api_secret", is(not(nullValue())))),
                "Webhook was not stored"
        );


        mvc.perform(post("/webhooks.unsubscribe")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString())
                .header(HttpHeaders.AUTHORIZATION, jwt.tokenFor("user-id")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", equalTo(url)))
                .andExpect(jsonPath("$.headers['X-Auth']", equalTo(xAuthHeader)))
                .andExpect(jsonPath("$.api_secret", is(not(nullValue()))));
    }

}
