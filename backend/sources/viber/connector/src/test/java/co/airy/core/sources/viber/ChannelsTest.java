package co.airy.core.sources.viber;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.core.sources.viber.lib.MockAccountInfo;
import co.airy.core.sources.viber.lib.Topics;
import co.airy.core.sources.viber.services.Api;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(MockAccountInfo.class)
@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class ChannelsTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @MockBean
    private Api api;

    @Autowired
    private AccountInfo accountInfo;

    @Autowired
    @InjectMocks
    private Connector worker;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private Stores stores;

    @Value("${ngrok}")
    private String ngrokHost;

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
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.openMocks(this);
        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canConnectChannels() throws Exception {
        ArgumentCaptor<String> webhookCaptor = ArgumentCaptor.forClass(String.class);
        doNothing().when(api).setWebhook(webhookCaptor.capture());
        doNothing().when(api).removeWebhook();
        Thread.sleep(5000);
        final String content = webTestHelper.post("/channels.viber.connect")
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        final JsonNode jsonNode = new ObjectMapper().readTree(content);

        final String expectedWebhook = ngrokHost + "/viber";
        assertEquals(expectedWebhook, webhookCaptor.getValue());

        List<Channel> channels = kafkaTestHelper.consumeValues(1, Topics.applicationCommunicationChannels.name());
        final Channel channel = channels.get(0);

        assertThat(accountInfo.getId(), equalTo(channel.getSourceChannelId()));
        assertThat(ChannelConnectionState.CONNECTED, equalTo(channel.getConnectionState()));

        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(1, Topics.applicationCommunicationMetadata.name());
        final Metadata metadata = metadataList.get(0);
        assertThat(MetadataKeys.ChannelKeys.NAME, equalTo(metadata.getKey()));
        assertThat(accountInfo.getName(), equalTo(metadata.getValue()));

        webTestHelper.post("/channels.viber.disconnect", "{\"channel_id\":\"" + jsonNode.get("id").textValue() + "\"}")
                .andExpect(status().isNoContent());

        channels = kafkaTestHelper.consumeValues(1, Topics.applicationCommunicationChannels.name());
        assertThat(ChannelConnectionState.DISCONNECTED, equalTo(channels.get(0).getConnectionState()));
    }
}
