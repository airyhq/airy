package co.airy.core.sources.instagram;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.instagram.api.Api;
import co.airy.core.sources.instagram.api.model.FaceBookMetadataKeys;
import co.airy.core.sources.instagram.api.model.PageWithConnectInfo;
import co.airy.core.sources.instagram.payload.ConnectInstagramRequestPayload;
import co.airy.core.sources.instagram.payload.ConnectPageRequestPayload;
import co.airy.core.sources.instagram.payload.ExploreRequestPayload;
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

import java.util.Arrays;
import java.util.List;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
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
    void canConnect() throws Exception {
        canFacebookConnect();
        canInstagramConnect();
    }

    private void canFacebookConnect() throws Exception {
        // Connect to facebook channel
        final ConnectPageRequestPayload connectPayload = this.mockConnectPageRequestPayload();
        final PageWithConnectInfo pageWithConnectInfo = this.mockPageWithConnectInfo();

        doReturn("new-long-live-token-string").when(api).exchangeToLongLivingUserAccessToken(connectPayload.getPageToken());
        doReturn(pageWithConnectInfo).when(api).getPageForUser(connectPayload.getPageId(), "new-long-live-token-string");
        doNothing().when(api).connectPageToApp(pageWithConnectInfo.getAccessToken());


        String content = webTestHelper.post(
                "/channels.facebook.connect",
                objectMapper.writeValueAsString(connectPayload))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        final String channelId = new ObjectMapper().readTree(content).get("id").textValue();

        List<Channel> channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        final Channel channel = channels.get(0);

        assertThat("facebook", equalTo(channel.getSource()));
        assertThat(pageWithConnectInfo.getId(), equalTo(channel.getSourceChannelId()));
        assertThat(ChannelConnectionState.CONNECTED, equalTo(channel.getConnectionState()));

        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(4, applicationCommunicationMetadata.name());
        metadataList.stream().forEach((metadata) -> {
            final String key = metadata.getKey();
            switch (key) {
                case MetadataKeys.ChannelKeys.NAME:
                    assertThat(pageWithConnectInfo.getNameWithLocationDescriptor(), equalTo(metadata.getValue()));
                    break;
                case MetadataKeys.ChannelKeys.IMAGE_URL:
                    assertThat(pageWithConnectInfo.getPicture().getData().getUrl(), equalTo(metadata.getValue()));
                    break;
                case FaceBookMetadataKeys.ChannelKeys.PAGE_ID:
                    assertThat(connectPayload.getPageId(), equalTo(metadata.getValue()));
                    break;
                case FaceBookMetadataKeys.ChannelKeys.PAGE_TOKEN:
                    assertThat(connectPayload.getPageToken(), equalTo(metadata.getValue()));
                    break;
                default:
                    assertThat(String.format("unexpected key: %s", key), false);
            }
        });

        // Explore facebook connected channels
        final ExploreRequestPayload explorePayload = new ExploreRequestPayload("explore-token-string");

        doReturn(Arrays.asList(pageWithConnectInfo)).when(api).getPagesInfo(explorePayload.getAuthToken());
        content = webTestHelper.post(
                "/channels.facebook.explore",
                objectMapper.writeValueAsString(explorePayload))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assertThat(content, equalTo("{\"data\":[{\"page_id\":\"7562107744668308\",\"name\":\"facebook app\",\"image_url\":\"facebook app image\",\"connected\":true}]}"));


        // Disconnect from facebook channel
        webTestHelper.post(
                "/channels.facebook.disconnect",
                String.format("{\"channel_id\":\"%s\"}", channelId))
            .andExpect(status().isNoContent());

        channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        assertThat(ChannelConnectionState.DISCONNECTED, equalTo(channels.get(0).getConnectionState()));
    }

    private void canInstagramConnect() throws Exception {
        // Connect to instagram channel
        final ConnectInstagramRequestPayload connectPayload = this.mockConnectInstagramRequestPayload();
        final PageWithConnectInfo pageWithConnectInfo = this.mockPageWithConnectInfo();

        doReturn("new-long-live-token-string").when(api).exchangeToLongLivingUserAccessToken(connectPayload.getPageToken());
        doReturn(pageWithConnectInfo).when(api).getPageForUser(connectPayload.getPageId(), "new-long-live-token-string");
        doNothing().when(api).connectPageToApp(pageWithConnectInfo.getAccessToken());


        final String content = webTestHelper.post(
                "/channels.instagram.connect",
                objectMapper.writeValueAsString(connectPayload))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        final String channelId = new ObjectMapper().readTree(content).get("id").textValue();

        List<Channel> channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        final Channel channel = channels.get(0);

        assertThat("instagram", equalTo(channel.getSource()));
        assertThat(connectPayload.getAccountId(), equalTo(channel.getSourceChannelId()));
        assertThat(ChannelConnectionState.CONNECTED, equalTo(channel.getConnectionState()));

        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(5, applicationCommunicationMetadata.name());
        metadataList.stream().forEach((metadata) -> {
            final String key = metadata.getKey();
            switch (key) {
                case MetadataKeys.ChannelKeys.NAME:
                    assertThat(pageWithConnectInfo.getNameWithLocationDescriptor(), equalTo(metadata.getValue()));
                    break;
                case FaceBookMetadataKeys.ChannelKeys.ACCOUNT_ID:
                    assertThat(connectPayload.getAccountId(), equalTo(metadata.getValue()));
                    break;
                case FaceBookMetadataKeys.ChannelKeys.PAGE_ID:
                    assertThat(connectPayload.getPageId(), equalTo(metadata.getValue()));
                    break;
                case FaceBookMetadataKeys.ChannelKeys.PAGE_TOKEN:
                    assertThat(connectPayload.getPageToken(), equalTo(metadata.getValue()));
                    break;
                case MetadataKeys.ChannelKeys.IMAGE_URL:
                    assertThat(connectPayload.getImageUrl(), equalTo(metadata.getValue()));
                    break;
                default:
                    assertThat(String.format("unexpected key: %s", key), false);
            }
        });

        // Disconnect from instagram channel
        webTestHelper.post(
                "/channels.instagram.disconnect",
                String.format("{\"channel_id\":\"%s\"}", channelId))
            .andExpect(status().isNoContent());

        channels = kafkaTestHelper.consumeValues(1, applicationCommunicationChannels.name());
        assertThat(ChannelConnectionState.DISCONNECTED, equalTo(channels.get(0).getConnectionState()));
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

    private ConnectInstagramRequestPayload mockConnectInstagramRequestPayload() {
        return new ConnectInstagramRequestPayload(
                "7562107744668308",
                "1847583685763736",
                "some-access-token",
                "facebook app",
                "instagram-image-url");
    }
}
