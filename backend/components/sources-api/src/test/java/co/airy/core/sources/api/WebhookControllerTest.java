package co.airy.core.sources.api;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.api.util.TestSource;
import co.airy.core.sources.api.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
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
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static co.airy.model.metadata.MetadataRepository.getSubject;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "systemToken=user-generated-api-token",
        "jwtSecret=long-randomly-generated-secret-used-as-jwt-secret-key",
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class WebhookControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private TestSource testSource;

    private static KafkaTestHelper kafkaTestHelper;

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
    void canIngestData() throws Exception {
        final String sourceId = "my-source";
        final String token = testSource.createSourceAndGetToken(sourceId);

        // Only accepts conversation and message metadata
        final String invalidMetadata = "{\"metadata\":[{\"namespace\":\"channel\",\"source_id\":\"source-id\",\"metadata\":{}}]}";
        mvc.perform(MockMvcRequestBuilders.post("/sources.webhook")
                .header(CONTENT_TYPE, APPLICATION_JSON.toString())
                .header(AUTHORIZATION, token)
                .content(invalidMetadata))
                .andExpect(status().isBadRequest());

        final String webhookPayload = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("webhook.json"), StandardCharsets.UTF_8);
        mvc.perform(MockMvcRequestBuilders.post("/sources.webhook")
                .header(CONTENT_TYPE, APPLICATION_JSON.toString())
                .header(AUTHORIZATION, token)
                .content(webhookPayload))
                .andExpect(status().isOk());

        final List<ConsumerRecord<String, Message>> messageRecords = kafkaTestHelper.consumeRecords(1, Topics.applicationCommunicationMessages.name());
        assertThat(messageRecords, hasSize(1));
        final Message message = messageRecords.get(0).value();
        assertThat(message.getSource(), equalTo(sourceId));
        final String messageId = message.getId();
        final String conversationId = message.getConversationId();

        final List<ConsumerRecord<String, Metadata>> metadataRecords = kafkaTestHelper.consumeRecords(2, Topics.applicationCommunicationMetadata.name());
        assertThat(metadataRecords, hasSize(2));

        final ConsumerRecord<String, Metadata> conversationMetadata = metadataRecords.stream().filter((metadata) -> getSubject(metadata.value()).getNamespace().equals("conversation")).findFirst().get();
        assertThat(getSubject(conversationMetadata.value()).getIdentifier(), equalTo(conversationId));

        final ConsumerRecord<String, Metadata> messageMetadata = metadataRecords.stream().filter((metadata) -> getSubject(metadata.value()).getNamespace().equals("message")).findFirst().get();
        assertThat(getSubject(messageMetadata.value()).getIdentifier(), equalTo(messageId));
    }
}
