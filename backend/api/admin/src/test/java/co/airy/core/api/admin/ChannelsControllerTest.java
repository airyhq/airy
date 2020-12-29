package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
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

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ChannelsControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationTags applicationCommunicationTags = new ApplicationCommunicationTags();

    @Autowired
    private WebTestHelper webTestHelper;

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

    private static boolean testDataInitialized = false;

    static final String facebookToken = "token";
    static final Channel connectedChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setName("connected channel name")
            .setSource("facebook")
            .setToken(facebookToken)
            .setSourceChannelId("source-channel-id")
            .build();

    @BeforeEach
    void beforeEach() throws Exception {
        if (testDataInitialized) {
            return;
        }

        testDataInitialized = true;

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(),
                connectedChannel.getId(), connectedChannel));

        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canListChannels() throws Exception {
        final String disconnectedChannel = "channel-id-2";

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), disconnectedChannel,
                        Channel.newBuilder()
                                .setConnectionState(ChannelConnectionState.DISCONNECTED)
                                .setId(disconnectedChannel)
                                .setName("channel-name-2")
                                .setSource("facebook")
                                .setSourceChannelId("ps-id-2")
                                .build()))
        );

        retryOnException(() -> webTestHelper.post("/channels.list", "{}", "user-id")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data.length()", greaterThanOrEqualTo(1)))
                        .andExpect(jsonPath("$.data[*].id").value(not(contains(disconnectedChannel)))),
                "/channels.list did not return the right number of channels");
    }

}
