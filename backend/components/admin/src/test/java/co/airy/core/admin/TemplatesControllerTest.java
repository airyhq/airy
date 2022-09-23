package co.airy.core.admin;

import co.airy.core.admin.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class TemplatesControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private ObjectMapper objectMapper;

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
    }

    @Test
    void canManageTemplates() throws Exception {
        final String name = "awesome-template";
        final String source = "facebook";
        final String content = "{\"blueprint\":\"text\",\"payload\":\"[[salutation]]!\"}";
        final String payload = "{\"name\":\"" + name + "\",\"source\": \"" + source + "\",\"content\":" + content + "}";

        final String createTemplateResponse = webTestHelper.post("/templates.create", payload)
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        final JsonNode jsonNode = objectMapper.readTree(createTemplateResponse);
        final String templateId = jsonNode.get("id").textValue();

        assertThat(templateId, is(not(nullValue())));

        retryOnException(() -> webTestHelper.post("/templates.info", "{\"id\":\"" + templateId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(is(templateId)))
                .andExpect(jsonPath("$.content.blueprint").value(is("text")))
                .andExpect(jsonPath("$.source").value(is(source)))
                .andExpect(jsonPath("$.name").value(is(name))), "could not find template");

        webTestHelper.post("/templates.update", "{\"id\":\"" + templateId + "\", \"name\": \"new-template-name\", \"source\": \"google\", \"content\": " + content + "}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(is(templateId)))
                .andExpect(jsonPath("$.content.blueprint").value(is("text")))
                .andExpect(jsonPath("$.source").value(is("google")))
                .andExpect(jsonPath("$.name").value(is("new-template-name")));

        retryOnException(() -> webTestHelper.post("/templates.info", "{\"id\":\"" + templateId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(is("new-template-name"))), "could not update template");

        webTestHelper.post("/templates.delete", "{\"id\": \"" + templateId + "\"}").andExpect(status().isNoContent());
    }

    @Test
    void canListTemplates() throws Exception {
        final String googleSource = "google";
        final String googleContent = "{\"blueprint\":\"text\",\"payload\":\"[[salutation]]!\"}";

        for (int i = 0; i < 10; i++) {
            final String name = "awesome-template-" + i;
            final String payload = "{\"name\":\"" + name + "\",\"source\": \"" + googleSource + "\",\"content\":" + googleContent + "}";

            webTestHelper.post("/templates.create", payload).andExpect(status().isCreated());
        }

        final String twilioSource = "twilio.sms";
        final String twilioContent = "{\"blueprint\":\"text\",\"payload\":\"[[salutation]]!\"}";
        for (int i = 0; i < 5; i++) {
            final String name = "awesome-template-" + i;
            final String payload = "{\"name\":\"" + name + "\",\"source\": \"" + twilioSource + "\",\"content\":" + twilioContent + "}";

            webTestHelper.post("/templates.create", payload).andExpect(status().isCreated());
        }

        retryOnException(() -> webTestHelper.post("/templates.list",
                "{\"source\": \"google\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(10))), "could not list google templates");

        retryOnException(() -> webTestHelper.post("/templates.list",
                "{\"source\": \"google\", \"name\": \"awesome-template-\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(10))), "could not list google templates by name");

        retryOnException(() -> webTestHelper.post("/templates.list",
                "{\"source\": \"google\", \"name\": \"awesome-template-1\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(1))), "could not list google templates by name");

        retryOnException(() -> webTestHelper.post("/templates.list",
                "{\"source\": \"twilio.sms\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(5))), "could not list twilio templates");

        retryOnException(() -> webTestHelper.post("/templates.list",
                "{\"source\": \"twilio.sms\", \"name\": \"awesome-template-\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(5))), "could not list twilio templates by name");

        retryOnException(() -> webTestHelper.post("/templates.list",
                "{\"source\": \"twilio.sms\", \"name\": \"awesome-template-1\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(1))), "could not list twilio templates by name");
    }
}
