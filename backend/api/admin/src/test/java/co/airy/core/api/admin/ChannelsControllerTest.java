package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.dto.ChannelMetadata;
import co.airy.core.api.admin.sources.facebook.FacebookSource;
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
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.doReturn;
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

    @SpyBean
    FacebookSource facebookSource;

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
        MockitoAnnotations.initMocks(this);

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

    @Test
    void canExploreChannels() throws Exception {
        final String channelName = "channel-name";

        doReturn(List.of(
                ChannelMetadata.builder()
                        .name(channelName)
                        .sourceChannelId("ps-id-1")
                        .build(),
                ChannelMetadata.builder()
                        .sourceChannelId(connectedChannel.getSourceChannelId())
                        .build()
        )).when(facebookSource).getAvailableChannels(facebookToken);

        retryOnException(() -> webTestHelper.post("/channels.explore",
                "{\"token\":\"" + facebookToken + "\",\"source\":\"facebook\"}", "user-id")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(2)))
                        .andExpect(jsonPath("$.data[0].name", equalTo(channelName)))
                        .andExpect(jsonPath("$.data[0].connected", equalTo(false)))
                        .andExpect(jsonPath("$.data[1].connected", equalTo(true))),
                "/channels.list did not return the mocked channels");
    }


    @Test
    void canConnectChannel() throws Exception {
        final String token = "token";
        final String channelName = "channel-name";
        final String sourceChannelId = "ps-id";

        doReturn(new ChannelMetadata()).when(facebookSource).connectChannel(token, sourceChannelId);

        final String payload = "{\"token\":\"" + token + "\",\"source\":\"facebook\"," +
                "\"source_channel_id\":\"" + sourceChannelId + "\"," +
                "\"name\":\"" + channelName + "\"" +
                "}";

        retryOnException(() ->
                        webTestHelper.post("/channels.connect", payload, "user-id")
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name", equalTo(channelName)))
                                .andExpect(jsonPath("$.source_channel_id", equalTo(sourceChannelId))),
                "/channels.connect failed");
    }

    @Test
    void disconnectChannel() throws Exception {
        final String channelId = UUID.randomUUID().toString();

        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(channelId)
                .setName("connected channel name")
                .setSource("facebook")
                .setToken("disconnect-token")
                .setSourceChannelId("disconnect-source-channel-id")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, channel));

        retryOnException(() ->
                        webTestHelper.post("/channels.disconnect",
                                "{\"channel_id\":\"" + channelId + "\"}", "user-id")
                                .andExpect(status().isOk()),
                "/channels.disconnect failed");

        Mockito.verify(facebookSource).disconnectChannel(channel.getToken(), channel.getSourceChannelId());
    }

}
