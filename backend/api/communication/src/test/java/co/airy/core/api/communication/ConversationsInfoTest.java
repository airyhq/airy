package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.User;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
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

import java.util.List;
import java.util.UUID;

import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationMetadata;
import static co.airy.core.api.communication.util.Topics.applicationCommunicationUsers;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newChannelMetadata;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class ConversationsInfoTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, getTopics());
        kafkaTestHelper.beforeAll();
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
    void canFetchConversationsInfo() throws Exception {
        final String channelName = "My sticker store";
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(UUID.randomUUID().toString())
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build();
        final String userId = "sender-user-id";
        final String userName = "Barbara Liskov";
        final User user = User.newBuilder()
                .setId(userId)
                .setName(userName)
                .setFirstSeenAt(0)
                .setLastSeenAt(0)
                .build();

        final Metadata metadata = newChannelMetadata(channel.getId(), MetadataKeys.ChannelKeys.NAME, channelName);
        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationUsers.name(), user.getId(), user),
                new ProducerRecord<>(applicationCommunicationMetadata.name(), getId(metadata).toString(), metadata),
                new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel)
        ));
        final String conversationId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, 1, userId));

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                                "{\"conversation_id\":\"" + conversationId + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath("$.last_message.sender.id", is(userId)))
                        .andExpect(jsonPath("$.last_message.sender.name", is(userName)))
                        .andExpect(jsonPath("$.channel.metadata.name", is(channelName))),
                "Cannot find conversation"
        );
    }
}
