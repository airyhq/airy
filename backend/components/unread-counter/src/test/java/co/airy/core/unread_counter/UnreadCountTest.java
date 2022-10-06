package co.airy.core.unread_counter;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
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

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class UnreadCountTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationReadReceipts applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, applicationCommunicationMetadata, applicationCommunicationReadReceipts);
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
    void canResetUnreadCount() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        final String messageId = UUID.randomUUID().toString();
        // Messages from Airy should not increase the unread count
        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId, Message.newBuilder()
                        .setId(messageId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("source-conversation-id")
                        .setDeliveryState(DeliveryState.DELIVERED)
                        .setSource("facebook")
                        .setConversationId(conversationId)
                        .setChannelId("channel-id")
                        .setContent("from airy")
                        .setIsFromContact(true)
                        .build())
        ));

        final String payload = "{\"conversation_id\":\"" + conversationId + "\"}";


        retryOnException(
                () -> {
                    final List<Metadata> metadataList = kafkaTestHelper.consumeValues(1, applicationCommunicationMetadata.name());

                    assertThat(metadataList.size(), equalTo(1));
                    assertThat(metadataList.stream().anyMatch((metadata) ->
                            metadata.getKey().equals(MetadataKeys.ConversationKeys.UNREAD_COUNT)
                                    && metadata.getValue().equals("1")), equalTo(true));
                },
                "Conversation unread count not set");

        webTestHelper.post("/conversations.mark-read", payload).andExpect(status().isNoContent());

        retryOnException(
                () -> {
                    final List<Metadata> metadataList = kafkaTestHelper.consumeValues(2, applicationCommunicationMetadata.name());

                    assertThat(metadataList.size(), equalTo(2));
                    assertThat(metadataList.stream().anyMatch((metadata) ->
                            metadata.getKey().equals(MetadataKeys.ConversationKeys.UNREAD_COUNT)
                                    && metadata.getValue().equals("0")), equalTo(true));

                    assertThat(metadataList.stream().anyMatch((metadata) ->
                            metadata.getKey().equals(MetadataKeys.MessageKeys.READ_BY_USER) && getSubject(metadata).getNamespace().equals("message")
                                    && getSubject(metadata).getIdentifier().equals(messageId)), equalTo(true));
                },
                "Conversation unread count not reset");

    }
}
