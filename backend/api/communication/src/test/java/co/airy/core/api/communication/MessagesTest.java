package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.date.format.DateFormat;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.avro.specific.SpecificRecordBase;
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

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationMessages;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationMetadata;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static co.airy.test.Timing.retryOnException;
import static java.util.Comparator.reverseOrder;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.core.StringContains.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class MessagesTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final String channelId = UUID.randomUUID().toString();
    private static final Channel channel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(channelId)
            .setSource("facebook")
            .setSourceChannelId("ps-id")
            .build();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, getTopics());
        kafkaTestHelper.beforeAll();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, channel));
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
    void canFetchMessages() throws Exception {
        final String conversationId = UUID.randomUUID().toString();

        int messageCount = 10;
        final List<ProducerRecord<String, SpecificRecordBase>> records = TestConversation.generateRecords(conversationId, channel, messageCount);
        kafkaTestHelper.produceRecords(records);

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";
        retryOnException(
                () -> webTestHelper.post("/messages.list", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(messageCount)))
                        .andExpect(jsonPath("$.data[*].sent_at").value(contains(
                                records.stream()
                                        .map((record) -> ((Message) record.value()).getSentAt())
                                        .map(DateFormat::isoFromMillis)
                                        .sorted(reverseOrder()).toArray()))),
                "/messages.list endpoint error");
    }

    @Test
    void canReturnMetadata() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        final String messageId = UUID.randomUUID().toString();
        final String text = "MESSAGE TEXT";

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId, Message.newBuilder()
                        .setId(messageId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("source-conversation-id")
                        .setDeliveryState(DeliveryState.DELIVERED)
                        .setSource("facebook")
                        .setConversationId(conversationId)
                        .setHeaders(Map.of())
                        .setChannelId(channel.getId())
                        .setContent("{\"text\":\"" + text + "\"}")
                        .setIsFromContact(true)
                        .build()),
                new ProducerRecord<>(applicationCommunicationMetadata.name(), "metadata-id",
                        newMessageMetadata(messageId, "metadata_key", "message metadata value"))
        ));

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";
        retryOnException(
                () -> webTestHelper.post("/messages.list", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1)))
                        .andExpect(jsonPath("$.data[0].metadata.metadata_key", containsString("message metadata value"))),
                "/messages.list metadata was not correct");
    }

    @Test
    void canReplaceMessageContentUrl() throws Exception {
        final String conversationId = UUID.randomUUID().toString();

        final String sourceUrl = "http://source.example.org/file.jpg?cache=1&tracking=all#section";
        final String persistentUrl = "http://airy.customer.org/data.jpg";

        final String messageId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId, Message.newBuilder()
                        .setId(messageId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("source-conversation-id")
                        .setDeliveryState(DeliveryState.DELIVERED)
                        .setSource("facebook")
                        .setConversationId(conversationId)
                        .setHeaders(Map.of())
                        .setChannelId(channel.getId())
                        .setContent(String.format("{\"url\":\"%s\"}", sourceUrl))
                        .setIsFromContact(true)
                        .build()),
                new ProducerRecord<>(applicationCommunicationMetadata.name(), "metadata-id",
                        newMessageMetadata(messageId, "data_" + sourceUrl, persistentUrl))
        ));

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";
        retryOnException(
                () -> webTestHelper.post("/messages.list", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1)))
                        .andExpect(jsonPath("$.data[0].content.url", containsString(persistentUrl))),
                "/messages.list content url was not replaced by metadata");
    }

    @Test
    void canReturnTwilioMessagesUnparsed() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        final String messageId = UUID.randomUUID().toString();
        final String sourceConversationId = "+491234567";
        final String text = "Hello World";
        final String sourceChannelId = "+497654321";
        final String token = "token";

        final String content = "ApiVersion=2010-04-01&SmsSid=SMbc31b6419de618d65076200c54676476&SmsStatus=received&SmsMessageSid=SMbc31b6419de618d65076200c54676476&NumSegments=1&To=whatsapp%3A%2B" +
                sourceChannelId +
                "&From=whatsapp%3A%2B" +
                sourceConversationId +
                "&MessageSid=SMbc31b6419de618d65076200c54676476&Body=Hi&AccountSid=AC64c9ab479b849275b7b50bd19540c602&NumMedia=0";

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                        .setToken(token)
                        .setSourceChannelId(sourceChannelId)
                        .setSource("twilio.sms")
                        .setId(channelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .build()
                ),
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                        Message.newBuilder()
                                .setId(messageId)
                                .setSource("twilio.sms")
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId(sourceConversationId)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId(conversationId)
                                .setChannelId(channelId)
                                .setContent(content)
                                .setIsFromContact(true)
                                .build())
        ));

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";
        retryOnException(
                () -> webTestHelper.post("/messages.list", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1)))
                        .andExpect(jsonPath("$.data[0].content", is(content))),
                "/messages.list content url was not replaced by metadata");
    }

    @Test
    void canSuggestReplies() throws Exception {
        final String messageId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                        Message.newBuilder()
                                .setId(messageId)
                                .setSource("twilio.sms")
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId("sourceConversationId")
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId(UUID.randomUUID().toString())
                                .setChannelId(channelId)
                                .setContent("content")
                                .setIsFromContact(true)
                                .build())
        ));

        final String suggestionId = "user-provided-id";
        final String suggestionContent = "{\"text\":\"Hello world\"}";
        final String payload = String.format("{\"message_id\":\"%s\",\"suggestions\":{\"%s\":{\"content\":%s}}}}",
                messageId, suggestionId, suggestionContent);

        retryOnException(
                () -> webTestHelper.post("/messages.suggestReplies", payload)
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", equalTo(messageId)))
                        .andExpect(jsonPath(String.format("$.metadata.suggestions['%s'].content.text", suggestionId), equalTo("Hello world"))),
                "/messages.suggestReplies did not insert suggestion metadata");
    }
}
