package co.airy.core.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.communication.util.TestConversation;
import co.airy.core.communication.util.Topics;
import co.airy.date.format.DateFormat;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
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
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
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

    private static final String firstNameToFind = "Grace";

    private static final Channel defaultChannel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("airy")
            .setSourceChannelId("ps-id")
            .build();

    private static final Channel channelToFind = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("facebook")
            .setSourceChannelId("special-external-channel-id")
            .build();

    private static final String conversationIdToFind = UUID.randomUUID().toString();
    private static final String tagId = UUID.randomUUID().toString();
    private static final String anotherTagId = UUID.randomUUID().toString();

    private static final List<TestConversation> conversations = List.of(
            TestConversation.from(UUID.randomUUID().toString(), channelToFind, Map.of(MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME, firstNameToFind), 1),
            TestConversation.from(UUID.randomUUID().toString(), channelToFind,
                    Map.of(MetadataKeys.ConversationKeys.TAGS + "." + tagId, "", MetadataKeys.ConversationKeys.TAGS + "." + anotherTagId, ""),
                    1),
            TestConversation.from(conversationIdToFind, defaultChannel, Map.of(MetadataKeys.ConversationKeys.TAGS + "." + tagId, ""), 1),
            TestConversation.from(UUID.randomUUID().toString(), defaultChannel, Map.of("user_data.erp.id", "abc", MetadataKeys.ConversationKeys.UNREAD_COUNT, "2"), 2),
            TestConversation.from(UUID.randomUUID().toString(), defaultChannel, Map.of(MetadataKeys.ConversationKeys.UNREAD_COUNT, "5"), 5)
    );

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());

        kafkaTestHelper.beforeAll();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(Topics.applicationCommunicationChannels.name(), defaultChannel.getId(), defaultChannel));
        kafkaTestHelper.produceRecord(new ProducerRecord<>(Topics.applicationCommunicationChannels.name(), channelToFind.getId(), channelToFind));

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
                () -> webTestHelper.post("/conversations.list")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(conversations.size())))
                        .andExpect(jsonPath("pagination_data.total", is(conversations.size())))
                        .andExpect(jsonPath("$.data[*].last_message.sent_at").value(contains(
                                conversations.stream()
                                        .map(TestConversation::getLastMessageSentAt)
                                        .map(DateFormat::isoFromMillis)
                                        .sorted(reverseOrder()).toArray()))),
                String.format("Expected %s conversations in order", conversations.size()));
    }

    @Test
    void canFetchPaginated() throws Exception {
        final int cursor = conversations.size() + 1;
        retryOnException(
                () -> webTestHelper.post("/conversations.list", "{\"cursor\": \"" + cursor + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(0)))
                        .andExpect(jsonPath("$.pagination_data.total", is(conversations.size()))),
                "Expected 0 conversations");

        webTestHelper.post("/conversations.list", "{\"page_size\": 2, \"cursor\": 0}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.pagination_data.total", is(conversations.size())))
                .andExpect(jsonPath("$.pagination_data.previous_cursor", is(not(nullValue()))))
                .andExpect(jsonPath("$.pagination_data.next_cursor", equalTo("2")));

        webTestHelper.post("/conversations.list", "{\"page_size\": 2, \"cursor\": 1}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pagination_data.total", is(conversations.size())))
                .andExpect(jsonPath("$.data", hasSize(2)));

        webTestHelper.post("/conversations.list", "{\"page_size\": 2, \"cursor\": 3}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.pagination_data.next_cursor", is(nullValue())));

        webTestHelper.post("/conversations.list", "{\"page_size\": 1, \"cursor\": 0}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pagination_data.total", is(conversations.size())))
                .andExpect(jsonPath("$.data", hasSize(1)));

        webTestHelper.post("/conversations.list", "{\"page_size\": 1, \"cursor\": 0, \"filters\": \"display_name:" + firstNameToFind.toLowerCase() + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pagination_data.total", is(1)))
                .andExpect(jsonPath("$.data", hasSize(1)));

        webTestHelper.post("/conversations.list", "{\"page_size\": 10000, \"cursor\": 0, \"filters\": \"display_name:" + firstNameToFind.toLowerCase() + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pagination_data.total", is(1)))
                .andExpect(jsonPath("$.data", hasSize(1)));
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
    void canFilterByDisplayNameIgnoringCasing() throws Exception {
        String payload = "{\"filters\": \"display_name:" + firstNameToFind.toLowerCase() + "\"}";
        checkConversationsFound(payload, 1);
    }

    @Test
    void canFilterByTagIds() throws Exception {
        checkConversationsFound("{\"filters\": \"tag_ids:(" + tagId + ")\"}", 2);

        checkConversationsFound("{\"filters\": \"tag_ids:(" + tagId + " AND " + anotherTagId + ")\"}", 1);
    }

    @Test
    void canFilterByUnreadMessageCountRange() throws Exception {
        checkConversationsFound("{\"filters\": \"unread_count:[2 TO *]\"}", 2);
    }

    @Test
    void canFilterByUnreadMessageCount() throws Exception {
        checkConversationsFound("{\"filters\": \"unread_count:2\"}", 1);
    }

    @Test
    void canFindBySource() throws Exception {
        checkConversationsFound("{\"filters\": \"source:" + channelToFind.getSource() + "\"}", 2);
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
        checkConversationsFound("{\"filters\": \"display_name:Ada\"}", 0);
    }

    @Test
    void canFilterByMetadata() throws Exception {
        checkConversationsFound("{\"filters\": \"metadata.user_data.erp.id:abc\"}", 1);
    }

    private void checkConversationsFound(String payload, int count) throws InterruptedException {
        retryOnException(
                () -> webTestHelper.post("/conversations.list", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(count)))
                        .andExpect(jsonPath("pagination_data.total", is(count))),
                String.format("Expected %d conversation returned", count));
    }
}
