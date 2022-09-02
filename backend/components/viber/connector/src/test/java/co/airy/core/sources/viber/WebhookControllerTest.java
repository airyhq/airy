package co.airy.core.sources.viber;

import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.core.sources.viber.lib.MockAccountInfo;
import co.airy.core.sources.viber.lib.Topics;
import co.airy.core.sources.viber.services.Api;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(MockAccountInfo.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class WebhookControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper testHelper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AccountInfo accountInfo;

    @MockBean
    private Api api;

    @Value("${authToken}")
    private String authToken;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @Test
    void failsForUnauthenticated() throws Exception {
        final String validationSignature = getValidationSignature("invalid key", "DROP TABLE");

        mvc.perform(post("/viber")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .header("X-Viber-Content-Signature", validationSignature)
                .content("DROP TABLE")
        ).andExpect(status().isForbidden());
    }

    @Test
    void repliesWithGreeting() throws Exception {
        final String conversationStarted = "{\"event\":\"conversation_started\",\"timestamp\":1457764197627,\"message_token\":4912661846655238145,\"type\":\"open\",\"context\":\"context information\",\"user\":{\"id\":\"01234567890A=\",\"name\":\"John McClane\",\"avatar\":\"http://avatar.example.com\",\"country\":\"UK\",\"language\":\"en\",\"api_version\":1},\"subscribed\":false}";
        final String validationSignature = getValidationSignature(authToken, conversationStarted);

        mvc.perform(post("/viber")
                .contentType(MediaType.APPLICATION_JSON)
                .content(conversationStarted)
                .header("X-Viber-Content-Signature", validationSignature)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text", is("Welcome message text")));

        List<String> records = testHelper.consumeValues(1, Topics.sourceViberEvents.name());
        assertThat(records, hasSize(1));
    }

    private String getValidationSignature(String authToken, String content) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(authToken.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmac = mac.doFinal(content.getBytes());
            StringBuilder builder = new StringBuilder();
            for (byte b : hmac) {
                builder.append(String.format("%02X", b).toLowerCase());
            }
            return builder.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate hmac-sha256", e);
        }
    }
}
