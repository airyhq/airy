package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.facebook.api.Api;
import co.airy.core.sources.facebook.payload.ConnectPageRequestPayload;
import co.airy.core.sources.facebook.api.model.PageWithConnectInfo;
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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import com.fasterxml.jackson.databind.JsonNode;
import org.mockito.InjectMocks;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doNothing;

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

    @Test
    void canConnect() throws Exception {
        final ConnectPageRequestPayload connectPayload = this.mockConnectPageRequestPayload();
        final PageWithConnectInfo pageWithConnectInfo = this.mockPageWithConnectInfo();

        doReturn("new-long-live-token-string").when(api).exchangeToLongLivingUserAccessToken(connectPayload.getPageToken());
        doReturn(pageWithConnectInfo).when(api).getPageForUser(connectPayload.getPageId(), "new-long-live-token-string");
        doNothing().when(api).connectPageToApp(pageWithConnectInfo.getAccessToken());


        final String content = webTestHelper.post(
                "/channels.facebook.connect",
                objectMapper.writeValueAsString(connectPayload))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        final JsonNode jsonNode = new ObjectMapper().readTree(content);

        List<Channel> channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        final Channel channel = channels.get(0);

        assertThat(pageWithConnectInfo.getId(), equalTo(channel.getSourceChannelId()));
        assertThat(ChannelConnectionState.CONNECTED, equalTo(channel.getConnectionState()));

        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(1, applicationCommunicationMetadata.name());
        final Metadata metadata = metadataList.get(0);

        assertThat(MetadataKeys.ChannelKeys.IMAGE_URL, equalTo(metadata.getKey()));
        assertThat(pageWithConnectInfo.getPicture().getData().getUrl(), equalTo(metadata.getValue()));
    }

    private ConnectPageRequestPayload mockConnectPageRequestPayload() {
        return new ConnectPageRequestPayload(
                "7562107744668308",
                "token-string",
                "facebook app",
                "facebook app image");
    }

    private PageWithConnectInfo mockPageWithConnectInfo() {
        return new PageWithConnectInfo(
                "7562107744668308",
                "facebook app",
                "some-access-token",
                new PageWithConnectInfo.PagePic(new PageWithConnectInfo.PagePic.PicData("facebook app image")),
                true);
    }
}
