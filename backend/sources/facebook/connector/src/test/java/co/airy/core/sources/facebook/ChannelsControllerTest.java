package co.airy.core.sources.facebook;

import co.airy.core.sources.facebook.api.Api;
import co.airy.core.sources.facebook.payload.ConnectPageRequestPayload;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.InjectMocks;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class ChannelsControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebTestHelper webTestHelper;

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @MockBean
    private Api api;

    @Autowired
    @InjectMocks
    private Connector worker;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationMessages,
                applicationCommunicationMetadata
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Test
    void canConnect() throws Exception {
        final ConnectPageRequestPayload connectPayload = this.mockConnectPageRequestPayload();
        final String endPoint = "/channels.facebook.connect";
        final String requestBody = objectMapper.writeValueAsString(connectPayload);

        final String content = webTestHelper.post(endPoint, requestBody)
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    private ConnectPageRequestPayload mockConnectPageRequestPayload() {
        return new ConnectPageRequestPayload(
                "7562107744668308",
                "36JbOHjxhUQeiPeUbIAXOk4RgbM9yO5MJXgs1Ya5UKmRPxKTgUYokxDAi3YtcrDQtTklDbcpqTWzOleVw5nUHgohVijZSRdBEzfXY9EgRzQ4VNPr6t575WUmjGedjIjsu4G7auMPcIVuzqt1W1jDol25eNYik2VCr3SNrhnfoJztqRi6ylxErIdDThVzHVK3nqdYtERv",
                "facebook app",
                "facebook app image");
    }
}