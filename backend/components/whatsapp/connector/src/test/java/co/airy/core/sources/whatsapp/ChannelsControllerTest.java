package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.api.Api;
import co.airy.core.sources.whatsapp.payload.ConnectChannelRequestPayload;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class ChannelsControllerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebTestHelper webTestHelper;

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @MockBean
    private Api api;

    @Autowired
    @InjectMocks
    private Connector worker;

    @Autowired
    private Stores stores;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationMessages,
                applicationCommunicationMetadata
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        MockitoAnnotations.openMocks(this);
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canConnectWhatsappChannel() throws Exception {
        final String phoneNumber = "1234567890";
        final String channelName = "My customer support phone number";

        final ConnectChannelRequestPayload connectPayload = ConnectChannelRequestPayload.builder()
                .phoneNumberId(phoneNumber)
                .name(channelName)
                .userToken("user token")
                .build();

        doReturn("new-long-live-token-string").when(api).exchangeToLongLivingUserAccessToken(connectPayload.getUserToken());

        String content = webTestHelper.post(
                "/channels.whatsapp.connect",
                objectMapper.writeValueAsString(connectPayload))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        final String channelId = new ObjectMapper().readTree(content).get("id").textValue();

        List<Channel> channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        final Channel channel = channels.get(0);

        assertThat("whatsapp", equalTo(channel.getSource()));
        assertThat(channel.getSourceChannelId(), equalTo(phoneNumber));
        assertThat(ChannelConnectionState.CONNECTED, equalTo(channel.getConnectionState()));

        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(4, applicationCommunicationMetadata.name());
        metadataList.forEach((metadata) -> {
            final String key = metadata.getKey();
            switch (key) {
                case MetadataKeys.ChannelKeys.NAME:
                    assertThat(channelName, equalTo(metadata.getValue()));
                    break;
                default:
                    throw new Error(String.format("unexpected key: %s", key));
            }
        });

        webTestHelper.post(
                "/channels.whatsapp.disconnect",
                String.format("{\"channel_id\":\"%s\"}", channelId))
            .andExpect(status().isNoContent());

        channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        assertThat(ChannelConnectionState.DISCONNECTED, equalTo(channels.get(0).getConnectionState()));
    }

}
