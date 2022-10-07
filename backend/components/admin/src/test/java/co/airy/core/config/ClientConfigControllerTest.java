package co.airy.core.config;

import co.airy.core.admin.util.Topics;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.CoreMatchers.everyItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ClientConfigControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @Autowired
    private WebTestHelper webTestHelper;

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
    public void canReturnConfigServices() throws Exception {
        mockServer.expect(once(), requestTo(new URI("http://airy-controller.default/services")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess("{\"services\": {\"api-communication\":{\"enabled\":true,\"component\":\"api-communication\"}}}", MediaType.APPLICATION_JSON)
                );

        mockServer.expect(once(), requestTo(new URI("http://api-communication.default/actuator/health")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess("{\"status\": \"DOWN\"}", MediaType.APPLICATION_JSON)
                );

        retryOnException(() ->
            webTestHelper.post("/client.config", "{}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.services.*", hasSize(1)))
                    .andExpect(jsonPath("$.services", hasKey("api-communication")))
                    .andExpect(jsonPath("$.services.*.enabled", everyItem(is(true))))
                    .andExpect(jsonPath("$.services.*.healthy", everyItem(is(false))))
                    .andExpect(jsonPath("$.tag_config.*", hasSize(1)))
                    .andExpect(jsonPath("$.tag_config", hasKey("colors")))
                    .andExpect(jsonPath("$.tag_config.colors", hasKey("tag-green")))
                    .andExpect(jsonPath("$.tag_config.colors.tag-green.*", hasSize(5)))
                    .andExpect(jsonPath("$.tag_config.colors", hasKey("tag-blue")))
                    .andExpect(jsonPath("$.tag_config.colors.tag-blue.*", hasSize(5)))
                    .andExpect(jsonPath("$.tag_config.colors", hasKey("tag-red")))
                    .andExpect(jsonPath("$.tag_config.colors.tag-red.*", hasSize(5)))
                    .andExpect(jsonPath("$.tag_config.colors", hasKey("tag-purple")))
                    .andExpect(jsonPath("$.tag_config.colors.tag-purple.*", hasSize(5))),
                "client.config call failed for services");
        mockServer.verify();
    }
}
