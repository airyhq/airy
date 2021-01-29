package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.date.format.DateFormat;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.hamcrest.core.StringContains;
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

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationMessages;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationMetadata;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static co.airy.test.Timing.retryOnException;
import static java.util.Comparator.reverseOrder;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
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

    private static final String channelId = "channel-id";
    private static final Channel channel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(channelId)
            .setName("channel-name")
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
                () -> webTestHelper.post("/messages.list", payload, "user-id")
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
                        .setSenderType(SenderType.SOURCE_CONTACT)
                        .setConversationId(conversationId)
                        .setHeaders(Map.of())
                        .setChannelId(channel.getId())
                        .setContent(String.format("{\"url\":\"%s\"}", sourceUrl))
                        .build()),
                new ProducerRecord<>(applicationCommunicationMetadata.name(), "metadata-id",
                        newMessageMetadata(messageId, "data_" + sourceUrl, persistentUrl))
        ));

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";
        retryOnException(
                () -> webTestHelper.post("/messages.list", payload, "user-id")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(1)))
                        .andExpect(jsonPath("$.data[0].content", containsString(persistentUrl))),
                "/messages.list content url was not replaced by metadata");
    }

}
