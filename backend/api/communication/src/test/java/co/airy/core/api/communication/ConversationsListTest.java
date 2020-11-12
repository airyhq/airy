package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.MetadataKeys;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.payload.format.DateFormat;
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

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import co.airy.core.api.communication.util.TestConversation;
import static co.airy.test.Timing.retryOnException;
import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class ConversationsListTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationReadReceipts applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata,
                applicationCommunicationReadReceipts
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
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
    private final String userId = "user-id";

    private final List<TestConversation> conversations = List.of(
            TestConversation.from(UUID.randomUUID().toString(), channelToFind, Map.of(MetadataKeys.source.contact.FIRST_NAME, firstNameToFind), 1),
            TestConversation.from(UUID.randomUUID().toString(), channelToFind, 1),
            TestConversation.from(conversationIdToFind, defaultChannel, 1),
            TestConversation.from(UUID.randomUUID().toString(), defaultChannel, 1),
            TestConversation.from(UUID.randomUUID().toString(), defaultChannel, 1)
    );

    @BeforeEach
    void beforeEach() throws Exception {
        if (testDataInitialized) {
            return;
        }

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), defaultChannel.getId(), defaultChannel));
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelToFind.getId(), channelToFind));

        kafkaTestHelper.produceRecords(conversations.stream().map(TestConversation::getRecords).flatMap(Collection::stream).collect(toList()));

        webTestHelper.waitUntilHealthy();

        testDataInitialized = true;
    }

    @Test
    void canFetchAllConversations() throws Exception {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", "{} ", userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(conversations.size())))
                        .andExpect(jsonPath("response_metadata.total", is(conversations.size()))),
                String.format("Expected %s conversations", conversations.size()));

        webTestHelper.post("/conversations.list", "{} ", userId)
                .andExpect(jsonPath("$.data[*].last_message.sent_at").value(contains(
                        conversations.stream()
                                .map(TestConversation::getLastMessageSentAt)
                                .map(DateFormat::ISO_FROM_MILLIS)
                                .sorted().toArray())));
    }

    @Test
    void canFilterByConversationId() throws Exception {
        String payload = "{\"filter\": {\"conversation_ids\": [\"" + conversationIdToFind + "\"]}}";

        checkOneConversationExists(payload);
    }

    @Test
    void canFilterByDisplayName() throws Exception {
        String payload = "{\"filter\": {\"display_names\": [\"" + firstNameToFind + "\"]}}";

        checkOneConversationExists(payload);
    }

    @Test
    void canFilterForUnknownNames() throws Exception {
        String payload = "{\"filter\": {\"display_names\": [\"Ada\"]}}";

        checkNoConversationReturned(payload);
    }

    private void checkNoConversationReturned(String payload) throws Exception {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", payload, userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(0))),
                "Expected no conversations returned");
    }

    private void checkOneConversationExists(String payload) throws InterruptedException {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", payload, userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1)))
                        .andExpect(jsonPath("response_metadata.total", is(conversations.size()))),
                "Expected one conversation returned");
    }
}
