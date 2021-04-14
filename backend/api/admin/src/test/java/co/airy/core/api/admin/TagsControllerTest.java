package co.airy.core.api.admin;

import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationTemplates;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
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

import java.util.concurrent.TimeUnit;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class TagsControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationTags applicationCommunicationTags = new ApplicationCommunicationTags();
    private static final ApplicationCommunicationTemplates applicationCommunicationTemplates = new ApplicationCommunicationTemplates();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private ObjectMapper objectMapper;

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
        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canManageTags() throws Exception {
        final String name = "awesome-tag";
        final String color = "tag-red";
        final String payload = "{\"name\":\"" + name + "\",\"color\": \"" + color + "\"}";

        final String createTagResponse = webTestHelper.post("/tags.create", payload, "user-id")
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        final JsonNode jsonNode = objectMapper.readTree(createTagResponse);
        final String tagId = jsonNode.get("id").textValue();

        //TODO wait for tag to be there
        TimeUnit.SECONDS.sleep(5);

        webTestHelper.post("/tags.list", "{}", "user-id")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(1)))
                .andExpect(jsonPath("$.data[0].id").value(is(tagId)))
                .andExpect(jsonPath("$.data[0].name").value(is(name)))
                .andExpect(jsonPath("$.data[0].color").value(is("RED")));

        webTestHelper.post("/tags.update",
                "{\"id\": \"" + tagId + "\", \"name\": \"new-name\", \"color\": \"" + color + "\"}", "user-id")
                .andExpect(status().isNoContent());

        webTestHelper.post("/tags.list", "{}", "user-id")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(1)))
                .andExpect(jsonPath("$.data[0].id").value(is(tagId)))
                .andExpect(jsonPath("$.data[0].name").value(is("new-name")))
                .andExpect(jsonPath("$.data[0].color").value(is("RED")));

        webTestHelper.post("/tags.delete", "{\"id\": \"" + tagId + "\"}", "user-id").andExpect(status().isNoContent());

        //TODO wait for tag deletion
        TimeUnit.SECONDS.sleep(5);

        webTestHelper.post("/tags.list", "{}", "user-id")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()", is(0)));
    }
}
