package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.ProducerRecord;
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

import java.util.List;
import java.util.UUID;

import static co.airy.core.api.communication.util.TestConversation.generateRecords;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class MetadataControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final Channel channel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .build();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, getTopics());

        kafkaTestHelper.beforeAll();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId().toString(), channel));
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
    void canUpsertMetadata() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));
        final List<ProducerRecord<String, SpecificRecordBase>> producerRecords = generateRecords(conversationId, channel, 1);
        kafkaTestHelper.produceRecords(producerRecords);
        final String messageId = producerRecords.get(0).key();

        // Test object, number, and list metadata
        retryOnException(
                () -> webTestHelper.post("/metadata.upsert",
                        "{\"subject\": \"message\", \"id\": \"" + messageId + "\", \"data\": {\"seq\":42, \"sentFrom\": \"iPhone\",\"assignees\": [\"Alice\",\"Bob\"]}}")
                        .andExpect(status().isNoContent()),
                "Error upserting metadata"
        );

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.last_message.metadata.user_data.sentFrom", is("iPhone")))
                        .andExpect(jsonPath("$.last_message.metadata.user_data.assignees").value(containsInAnyOrder("Alice", "Bob")))
                        .andExpect(jsonPath("$.last_message.metadata.user_data.seq", is(42.0))),
                "Conversations list metadata is not present"
        );
    }
}
