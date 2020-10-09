package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.MetadataKeys;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
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

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static co.airy.core.api.communication.util.ConversationGenerator.CreateConversation;
import static co.airy.core.api.communication.util.ConversationGenerator.getConversationRecords;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100"
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class ConversationsFilterTest {


    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;

    @Autowired
    private MockMvc mvc;

    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationReadReceipts applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts();

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata,
                applicationCommunicationReadReceipts
        );

        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    private static boolean testDataInitialized = false;

    private final String firstNameToFind = "Grace";

    private final Channel defaultChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("channel-id")
            .setName("channel-name")
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .build();

    private final Channel channelToFind = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("special-channel-id")
            .setName("channel-name")
            .setSource("facebook")
            .setSourceChannelId("special-external-channel-id")
            .build();

    private final String conversationIdToFind = UUID.randomUUID().toString();

    private final List<CreateConversation> conversations = List.of(
            CreateConversation.builder()
                    .metadata(
                            Map.of(
                                    MetadataKeys.SOURCE.CONTACT.FIRST_NAME, firstNameToFind
                            ))
                    .conversationId(UUID.randomUUID().toString())
                    .messageCount(1L)
                    .channel(defaultChannel)
                    .build(),
            CreateConversation.builder()
                    .conversationId(UUID.randomUUID().toString())
                    .messageCount(1L)
                    .channel(channelToFind)
                    .build(),
            CreateConversation.builder()
                    .conversationId(conversationIdToFind)
                    .messageCount(1L)
                    .channel(defaultChannel)
                    .build(),
            CreateConversation.builder()
                    .conversationId(UUID.randomUUID().toString())
                    .messageCount(1L)
                    .channel(defaultChannel)
                    .build(),
            CreateConversation.builder()
                    .conversationId(UUID.randomUUID().toString())
                    .messageCount(1L)
                    .channel(defaultChannel)
                    .build()
    );

    @BeforeEach
    void init() throws Exception {
        if (testDataInitialized) {
            return;
        }

        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), defaultChannel.getId(), defaultChannel));
        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelToFind.getId(), channelToFind));

        testHelper.produceRecords(getConversationRecords(conversations));

        testHelper.waitForCondition(
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy"
        );

        testDataInitialized = true;
    }

    @Test
    void returnAll() throws Exception {
        testHelper.waitForCondition(
                () -> mvc.perform(post("/conversations.list")
                        .headers(buildHeaders())
                        .content("{}}"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(conversations.size())))
                        .andExpect(jsonPath("response_metadata.total", is(conversations.size()))),
                "Expected one conversation returned"
        );
    }

    @Test
    void filterOutConversationForConversationId() throws Exception {
        String payload = "{\"filter\": {\"conversation_ids\": [\"" + conversationIdToFind + "\"]}}";

        checkOneConversationExists(payload);
    }


    @Test
    void filterInConversationByDisplayName() throws Exception {
        String payload = "{\"filter\": {\"display_names\": [\"" + firstNameToFind + "\"]}}";

        checkOneConversationExists(payload);
    }

    @Test
    void filterOutConversationForUnknownDisplayName() throws Exception {
        String payload = "{\"filter\": {\"display_names\": [\"Ada\"]}}";

        checkNoConversationReturned(payload);
    }

    private void checkNoConversationReturned(String payload) throws Exception {
        testHelper.waitForCondition(
                () -> mvc.perform(post("/conversations.list")
                        .headers(buildHeaders())
                        .content(payload))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(0))),
                "Expected no conversations returned"
        );
    }

    private void checkOneConversationExists(String payload) throws InterruptedException {
        testHelper.waitForCondition(
                () -> mvc.perform(post("/conversations.list")
                        .headers(buildHeaders())
                        .content(payload))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1)))
                        .andExpect(jsonPath("response_metadata.total", is(conversations.size()))),
                "Expected one conversation returned"
        );
    }


    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }
}
