package co.airy.core.sources.api;

import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationSources;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "systemToken=user-generated-api-token",
        "jwtSecret=long-randomly-generated-secret-used-as-jwt-secret-key",
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class CreateSourceTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private MockMvc mvc;

    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationSources applicationCommunicationSources = new ApplicationCommunicationSources();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels, applicationCommunicationSources, applicationCommunicationMetadata
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
    void canCreateSourceAndChannel() throws Exception {
        final String sourceId = "my-source";
        String payload = "{\"source_id\":\"" + sourceId + "\"}";

        final String response = webTestHelper.post("/sources.create", payload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.source_id", is(not(nullValue()))))
                .andExpect(jsonPath("$.token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();

        final JsonNode node = new ObjectMapper().readTree(response);
        final String token = node.get("token").textValue();

        final String channelPayload = "{\"name\":\"source channel\",\"source_channel_id\":\"my-source-channel-1\"}";

        mvc.perform(MockMvcRequestBuilders.post("/sources.createChannel")
                .header(CONTENT_TYPE, APPLICATION_JSON.toString())
                .content(channelPayload))
                .andExpect(status().isForbidden());

        retryOnException(() -> mvc.perform(MockMvcRequestBuilders.post("/sources.createChannel")
                .header(CONTENT_TYPE, APPLICATION_JSON.toString())
                .header(AUTHORIZATION, token)
                .content(channelPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.source", equalTo(sourceId))), "Channel was not created");
    }
}
