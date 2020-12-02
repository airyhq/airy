package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.MetadataKeys;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.payload.format.DateFormat;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
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

import static co.airy.test.Timing.retryOnException;
import static java.util.Comparator.reverseOrder;
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

    private static final String firstNameToFind = "Grace";

    private static final Channel defaultChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("channel-id")
            .setName("channel-name")
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .build();

    private static final Channel channelToFind = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId("special-channel-id")
            .setName("channel-name")
            .setSource("facebook")
            .setSourceChannelId("special-external-channel-id")
            .build();

    private static final String conversationIdToFind = UUID.randomUUID().toString();
    private static final String userId = "user-id";

    private static final List<TestConversation> conversations = List.of(
            TestConversation.from(UUID.randomUUID().toString(), channelToFind, Map.of(MetadataKeys.Source.Contact.FIRST_NAME, firstNameToFind), 1),
            TestConversation.from(UUID.randomUUID().toString(), channelToFind, 1),
            TestConversation.from(conversationIdToFind, defaultChannel, 1),
            TestConversation.from(UUID.randomUUID().toString(), defaultChannel, 1),
            TestConversation.from(UUID.randomUUID().toString(), defaultChannel, 1)
    );


    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata,
                applicationCommunicationReadReceipts
        );

        kafkaTestHelper.beforeAll();


        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), defaultChannel.getId(), defaultChannel));
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelToFind.getId(), channelToFind));

        kafkaTestHelper.produceRecords(conversations.stream().map(TestConversation::getRecords).flatMap(Collection::stream).collect(toList()));
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }


    @BeforeEach
    void beforeEach() throws Exception {
        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canFetchAllConversations() throws Exception {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", "{} ", userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(conversations.size())))
                        .andExpect(jsonPath("response_metadata.total", is(conversations.size())))
                        .andExpect(jsonPath("$.data[*].last_message.sent_at").value(contains(
                                conversations.stream()
                                        .map(TestConversation::getLastMessageSentAt)
                                        .map(DateFormat::isoFromMillis)
                                        .sorted(reverseOrder()).toArray()))),
                String.format("Expected %s conversations in order", conversations.size()));
    }

    @Test
    void canFilterByConversationId() throws Exception {
        final JsonNodeFactory jsonNodeFactory = JsonNodeFactory.instance;

        final ObjectNode request = jsonNodeFactory.objectNode();
        request.put("filters", "id:\"" + conversationIdToFind.replace("-", "\\-") + "\"");

        checkConversationsFound(request.toString(), 1);
    }

    @Test
    void canFilterByDisplayName() throws Exception {
        String payload = "{\"filters\": \"display_name:" + firstNameToFind + "\"}";
        checkConversationsFound(payload, 1);
    }

    @Test
    void canFilterByCombinedQueries() throws Exception {
        final JsonNodeFactory jsonNodeFactory = JsonNodeFactory.instance;

        final ObjectNode request = jsonNodeFactory.objectNode();
        request.put("filters", "display_name:" + firstNameToFind
                + " OR id:\"" + conversationIdToFind.replace("-", "\\-") + "\"");

        checkConversationsFound(request.toString(), 2);
    }

    @Test
    void canFilterForUnknownNames() throws Exception {
        String payload = "{\"filters\": \"display_name:Ada\"}";
        checkNoConversationReturned(payload);
    }

    private void checkNoConversationReturned(String payload) throws Exception {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", payload, userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(0))),
                "Expected no conversations returned");
    }

    private void checkConversationsFound(String payload, int count) throws InterruptedException {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", payload, userId)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(count)))
                        .andExpect(jsonPath("response_metadata.filtered_total", is(count)))
                        .andExpect(jsonPath("response_metadata.total", is(conversations.size()))),
                "Expected one conversation returned");
    }
}
