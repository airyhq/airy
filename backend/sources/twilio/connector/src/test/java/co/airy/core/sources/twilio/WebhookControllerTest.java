package co.airy.core.sources.twilio;

import co.airy.kafka.schema.source.SourceTwilioEvents;
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
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class WebhookControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper testHelper;
    private static final SourceTwilioEvents sourceTwilioEvents = new SourceTwilioEvents();

    @Autowired
    private MockMvc mvc;

    @Value("${twilio.auth-token}")
    private String authToken;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new KafkaTestHelper(sharedKafkaTestResource, sourceTwilioEvents);
        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @Test
    void failsForUnauthenticated() throws Exception {
        final Map<String, String> parameters = Map.of(
                "ApiVersion", "2010-04-01",
                "SmsSid", "MM3753d789407e9d3f4c0a8b919ec5473f"
        );

        final String validationSignature = getValidationSignature(parameters, "DROP TABLE");

        mvc.perform(post("/twilio")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .header("X-Twilio-Signature", validationSignature)
                .content("ApiVersion=2010-04-01&SmsSid=MM3753d789407e9d3f4c0a8b919ec5473f")
        ).andExpect(status().isForbidden());
    }

    @Test
    void canAcceptRequests() throws Exception {
        final Map<String, String> parameters = Map.of(
                "ApiVersion", "2010-04-01",
                "SmsSid", "MM3753d789407e9d3f4c0a8b919ec5473f"
        );

        final String validationSignature = getValidationSignature(parameters, authToken);

        mvc.perform(post("/twilio")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .content("ApiVersion=2010-04-01&SmsSid=MM3753d789407e9d3f4c0a8b919ec5473f")
                .header("X-Twilio-Signature", validationSignature)
        )
                .andExpect(status().isOk());

        List<String> records = testHelper.consumeValues(1, sourceTwilioEvents.name());

        assertThat(records, hasSize(1));
    }

    private static final String HMAC = "HmacSHA1";

    // Adapted from com.twilio.security.RequestValidator only for testing
    private String getValidationSignature(Map<String, String> params, String authToken) {
        try {
            final SecretKeySpec signingKey = new SecretKeySpec(authToken.getBytes(), HMAC);

            StringBuilder builder = new StringBuilder("http://localhost/twilio");
            if (params != null) {
                List<String> sortedKeys = new ArrayList<>(params.keySet());
                Collections.sort(sortedKeys);

                for (String key : sortedKeys) {
                    builder.append(key);

                    String value = params.get(key);
                    builder.append(value == null ? "" : value);
                }
            }

            Mac mac = Mac.getInstance(HMAC);
            mac.init(signingKey);

            byte[] rawHmac = mac.doFinal(builder.toString().getBytes(StandardCharsets.UTF_8));
            return DatatypeConverter.printBase64Binary(rawHmac);

        } catch (Exception e) {
            return null;
        }
    }
}
