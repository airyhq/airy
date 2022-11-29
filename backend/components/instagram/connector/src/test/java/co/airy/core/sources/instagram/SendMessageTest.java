package co.airy.core.sources.instagram;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.instagram.api.Api;
import co.airy.core.sources.instagram.api.ApiException;
import co.airy.core.sources.instagram.api.model.SendMessagePayload;
import co.airy.core.sources.instagram.api.model.SendMessageResponse;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.ProducerRecord;
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
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
class SendMessageTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @Autowired
    @InjectMocks
    private Connector connector;

    @Autowired
    private Stores stores;

    @MockBean
    private Api api;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationMessages,
                applicationCommunicationMetadata
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.openMocks(this);
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canSendMessage() throws Exception {
        final String conversationId = "conversationId";
        final String messageId = "message-id";
        final String failingMessageId = "message-id-failing";
        final String sourceConversationId = "source-conversation-id";
        final String channelId = "channel-id";
        final String token = "token";
        final String text = "Hello World";
        final String errorMessage = "message delivery failed";

        ArgumentCaptor<SendMessagePayload> payloadCaptor = ArgumentCaptor.forClass(SendMessagePayload.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        when(api.sendMessage(tokenCaptor.capture(), payloadCaptor.capture()))
                .thenReturn(new SendMessageResponse("recipient id", "message id"))
                .thenThrow(new ApiException(errorMessage));

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                        .setToken(token)
                        .setSourceChannelId("ps-id")
                        .setSource("instagram")
                        .setId(channelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .build()
                ),
                new ProducerRecord<>(applicationCommunicationMessages.name(), "other-message-id",
                        Message.newBuilder()
                                .setId("other-message-id")
                                .setSource("instagram")
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId(sourceConversationId)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId(conversationId)
                                .setChannelId(channelId)
                                .setContent("{\"text\":\"" + text + "\"}")
                                .setIsFromContact(true)
                                .build())
        ));

        TimeUnit.SECONDS.sleep(5);

        final ObjectMapper objectMapper = new ObjectMapper();
        final JsonNode messagePayload = objectMapper.readTree("{\"text\":\"Hello Facebook\"}");

        kafkaTestHelper.produceRecords(List.of(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                Message.newBuilder()
                        .setId(messageId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("user-id")
                        .setDeliveryState(DeliveryState.PENDING)
                        .setConversationId(conversationId)
                        .setChannelId(channelId)
                        .setSource("instagram")
                        .setContent(objectMapper.writeValueAsString(messagePayload))
                        .setIsFromContact(false)
                        .build()),
                // This message should fail
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                        Message.newBuilder()
                                .setId(failingMessageId)
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId("user-id")
                                .setDeliveryState(DeliveryState.PENDING)
                                .setConversationId(conversationId)
                                .setChannelId(channelId)
                                .setSource("instagram")
                                .setContent(objectMapper.writeValueAsString(messagePayload))
                                .setIsFromContact(false)
                                .build())
        ));

        retryOnException(() -> {
            final SendMessagePayload sendMessagePayload = payloadCaptor.getValue();
            assertThat(sendMessagePayload.getRecipient().getId(), equalTo(sourceConversationId));
            assertThat(sendMessagePayload.getMessage(), equalTo(messagePayload));

            assertThat(tokenCaptor.getValue(), equalTo(token));
        }, "Facebook API was not called");

        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(3, applicationCommunicationMetadata.name());

        assertThat(metadataList.size(), equalTo(3));
        assertThat(metadataList.stream().anyMatch((metadata) ->
                metadata.getKey().equals(MetadataKeys.MessageKeys.ERROR)
                        && metadata.getValue().equals(errorMessage)
                        && getSubject(metadata).getIdentifier().equals(failingMessageId)), equalTo(true));
    }
}
