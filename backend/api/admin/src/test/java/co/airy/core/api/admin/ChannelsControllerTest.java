package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.dto.ChannelMetadata;
import co.airy.core.api.admin.payload.AvailableChannelPayload;
import co.airy.core.api.admin.sources.facebook.FacebookSource;
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
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100",
        "facebook.app-id=1234",
        "facebook.app-secret=secret"
}, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ChannelsControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;

    @Autowired
    private MockMvc mvc;

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

    @SpyBean
    FacebookSource facebookSource;

    private static boolean testDataInitialized = false;

    final static String facebookToken = "token";
    final static Channel connectedChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setName("connected channel name")
            .setSource("FACEBOOK")
            .setToken(facebookToken)
            .setSourceChannelId("source-channel-id")
            .build();

    @BeforeEach
    void init() throws Exception {
        MockitoAnnotations.initMocks(this);

        if (testDataInitialized) {
            return;
        }

        testDataInitialized = true;

        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(),
                connectedChannel.getId(),
                connectedChannel
        ));

        testHelper.waitForCondition(
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy"
        );

    }

    @Test
    void connectedChannels() throws Exception {
        testHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), "channel-id-2",
                        Channel.newBuilder()
                                .setConnectionState(ChannelConnectionState.DISCONNECTED)
                                .setId("channel-id-2")
                                .setName("channel-name-2")
                                .setSource("FACEBOOK")
                                .setSourceChannelId("ps-id-2")
                                .build()
                ))
        );

        testHelper.waitForCondition(() -> mvc.perform(post("/channels.connected").
                        headers(buildHeaders()))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1))),
                "/channels.connected did not return the right number of channels"
        );
    }

    @Test
    void availableChannels() throws Exception {
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

        testHelper.waitForCondition(() -> mvc.perform(post("/channels.available")
                        .headers(buildHeaders())
                        .content("{\"token\":\"" + facebookToken + "\",\"source\":\"FACEBOOK\"}"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(2)))
                        .andExpect(jsonPath("$.data[0].name", equalTo(channelName)))
                        .andExpect(jsonPath("$.data[0].connected", equalTo(false)))
                        .andExpect(jsonPath("$.data[1].connected", equalTo(true)))
                ,
                "/channels.available did not return the mocked channels"
        );
    }


    @Test
    void connectChannel() throws Exception {
        final String token = "token";
        final String channelName = "channel-name";
        final String sourceChannelId = "ps-id";

        doReturn(new ChannelMetadata()).when(facebookSource).connectChannel(token, sourceChannelId);

        final String payload = "{\"token\":\"" + token + "\",\"source\":\"FACEBOOK\"," +
                "\"source_channel_id\":\"" + sourceChannelId + "\"," +
                "\"name\":\"" + channelName + "\"" +
                "}";

        testHelper.waitForCondition(() -> mvc.perform(post("/channels.connect")
                        .headers(buildHeaders())
                        .content(payload))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.name", equalTo(channelName)))
                        .andExpect(jsonPath("$.source_channel_id", equalTo(sourceChannelId)))
                ,
                "/channels.connect failed"
        );
    }

    @Test
    void disconnectChannel() throws Exception {
        testHelper.waitForCondition(() -> mvc.perform(post("/channels.disconnect")
                        .headers(buildHeaders())
                        .content("{\"channel_id\":\"" + connectedChannel.getId() + "\"}"))
                        .andExpect(status().isOk()),
                "/channels.disconnect failed"
        );

        Mockito.verify(facebookSource).disconnectChannel(connectedChannel.getToken(), connectedChannel.getSourceChannelId());
    }


    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }
}
