package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100"
}, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ChannelsControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;

    @Autowired
    private MockMvc mvc;

    private static boolean testDataInitialized = false;
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels
        );
        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @BeforeEach
    void initializeTestDataOnce() throws Exception {
        if (testDataInitialized) {
            return;
        }

        testHelper.waitForCondition(
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy"
        );

        testDataInitialized = true;
    }

    @Test
    void connectedChannels() throws Exception {
        testHelper.produceRecords(
                new ProducerRecord<>(applicationCommunicationChannels.name(), "channel-id-1",
                        Channel.newBuilder()
                                .setConnectionState(ChannelConnectionState.CONNECTED)
                                .setId("channel-id-1")
                                .setName("channel-name-2")
                                .setSource("FACEBOOK")
                                .setSourceChannelId("ps-id-1")
                                .build()
                ),
                new ProducerRecord<>(applicationCommunicationChannels.name(), "channel-id-2",
                        Channel.newBuilder()
                                .setConnectionState(ChannelConnectionState.DISCONNECTED)
                                .setId("channel-id-2")
                                .setName("channel-name-2")
                                .setSource("FACEBOOK")
                                .setSourceChannelId("ps-id-2")
                                .build()
                )
        );

        testHelper.waitForCondition(() -> mvc.perform(post("/channels.connected").
                headers(buildHeaders()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1))),
                "/channels.connected did not return the right number of channels"
        );
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }
}
