package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.payload.format.DateFormat;
import co.airy.spring.auth.Jwt;
import co.airy.spring.core.AirySpringBootApplication;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static co.airy.core.api.communication.util.ConversationGenerator.getMessages;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
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
public class MessagesTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static TestHelper testHelper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private Jwt jwt;

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

    @BeforeEach
    void init() throws Exception {
        testHelper.waitForCondition(
                () -> mvc.perform(get("/health")).andExpect(status().isOk()),
                "Application is not healthy");
    }

    @Test
    void messageListOk() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        final String channelId = "channelId";
        final String userId = "user-id";

        testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(channelId)
                .setName("channel-name")
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build()
        ));

        int messageCount = 10;
        final List<ProducerRecord<String, SpecificRecordBase>> records = getMessages(10, channelId, conversationId);

        testHelper.produceRecords(records);

        String requestPayload = "{\"conversation_id\":\"" + conversationId + "\"}";

        testHelper.waitForCondition(
                () -> mvc.perform(post("/messages.list")
                        .headers(buildHeaders(userId))
                        .content(requestPayload))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(messageCount)))
                        .andExpect(jsonPath("$.data[*].sent_at").value(contains(
                                records.stream()
                                        .map((record) -> ((Message) record.value()).getSentAt())
                                        .map(DateFormat::ISO_FROM_MILLIS)
                                        .sorted().toArray())))
                , "/messages.list endpoint error");
    }

    private HttpHeaders buildHeaders(String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, jwt.tokenFor(userId));
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }
}
