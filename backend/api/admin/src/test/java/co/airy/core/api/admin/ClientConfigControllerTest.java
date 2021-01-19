package co.airy.core.api.admin;

import co.airy.core.api.config.ClientConfigController;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
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

    @InjectMocks
    private ClientConfigController configController;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationTags applicationCommunicationTags = new ApplicationCommunicationTags();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationWebhooks,
                applicationCommunicationTags
        );
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
    public void canReturnConfig() throws Exception {
        mockServer.expect(requestTo(new URI("http://sources-chatplugin.default/actuator/health")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK));

        mockServer.expect(requestTo(new URI("http://sources-facebook-connector.default/actuator/health")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK));

        mockServer.expect(requestTo(new URI("http://sources-twilio-connector.default/actuator/health")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK));

        mockServer.expect(requestTo(new URI("http://sources-google-connector.default/actuator/health")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.OK));

        webTestHelper.post("/client.config", "{}", "user-id").andExpect(status().isOk());
    }

}
