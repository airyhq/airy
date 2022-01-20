package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.util.Topics;
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
import static org.hamcrest.Matchers.equalTo;
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

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    private static boolean testDataInitialized = false;

    static final Channel connectedChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("facebook")
            .setSourceChannelId("source-channel-id")
            .build();

    @BeforeEach
    void beforeEach() throws Exception {
        if (testDataInitialized) {
            return;
        }

        testDataInitialized = true;

        kafkaTestHelper.produceRecord(new ProducerRecord<>(Topics.applicationCommunicationChannels.name(),
                connectedChannel.getId(), connectedChannel));

        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canListChannels() throws Exception {
        final String disconnectedChannel = "channel-id-2";

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(Topics.applicationCommunicationChannels.name(), disconnectedChannel,
                        Channel.newBuilder()
                                .setConnectionState(ChannelConnectionState.DISCONNECTED)
                                .setId(disconnectedChannel)
                                .setSource("facebook")
                                .setSourceChannelId("ps-id-2")
                                .build())
        ));

        retryOnException(() -> webTestHelper.post("/channels.list", "{}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data.length()", greaterThanOrEqualTo(1)))
                        .andExpect(jsonPath("$.data[*].id").value(not(contains(disconnectedChannel)))),
                "/channels.list did not return the right number of channels");
    }

    @Test
    void canUpdateChannel() throws Exception {
        final String expectedChannelName = "channel name";

        retryOnException(() -> webTestHelper.post("/channels.info", String.format("{\"channel_id\":\"%s\"}", connectedChannel.getId()))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", equalTo(connectedChannel.getId())))
                        .andExpect(jsonPath("$.metadata.name", not(equalTo(expectedChannelName)))),
                "/channels.info did not return the right channel");

        webTestHelper.post("/channels.update", String.format("{\"channel_id\":\"%s\",\"name\":\"%s\"}",
                connectedChannel.getId(), expectedChannelName))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", equalTo(connectedChannel.getId())))
                        .andExpect(jsonPath("$.metadata.name", not(equalTo(connectedChannel.getId()))))
                        .andExpect(jsonPath("$.source", equalTo(connectedChannel.getSource())));

        retryOnException(() -> webTestHelper.post("/channels.info", String.format("{\"channel_id\":\"%s\"}", connectedChannel.getId()))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", equalTo(connectedChannel.getId())))
                        .andExpect(jsonPath("$.metadata.name", equalTo(expectedChannelName))),
                "/channels.update did not update");
    }

}
