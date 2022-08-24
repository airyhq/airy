package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.api.Api;
import co.airy.core.sources.whatsapp.api.ApiException;
import co.airy.core.sources.whatsapp.api.model.SendMessageResponse;
import co.airy.core.sources.whatsapp.dto.SendMessageRequest;
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
        final String whatsappMessageId = "whatsapp message id";

        ArgumentCaptor<SendMessageRequest> payloadCaptor = ArgumentCaptor.forClass(SendMessageRequest.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        when(api.sendMessage(payloadCaptor.capture()))
                .thenReturn(SendMessageResponse.builder()
                        .messages(List.of(new SendMessageResponse.Message(whatsappMessageId)))
                        .build())
                .thenThrow(new ApiException(errorMessage));

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                        .setToken(token)
                        .setSourceChannelId("ps-id")
                        .setSource("whatsapp")
                        .setId(channelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .build()
                ),
                new ProducerRecord<>(applicationCommunicationMessages.name(), "other-message-id",
                        Message.newBuilder()
                                .setId("other-message-id")
                                .setSource("whatsapp")
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
        final JsonNode messagePayload = objectMapper.readTree("{\"text\":\"Hello Whatsapp\"}");

        kafkaTestHelper.produceRecords(List.of(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                        Message.newBuilder()
                                .setId(messageId)
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId("user-id")
                                .setDeliveryState(DeliveryState.PENDING)
                                .setConversationId(conversationId)
                                .setChannelId(channelId)
                                .setSource("whatsapp")
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
                                .setSource("whatsapp")
                                .setContent(objectMapper.writeValueAsString(messagePayload))
                                .setIsFromContact(false)
                                .build())
        ));


        final List<Metadata> metadataList = kafkaTestHelper.consumeValues(2, applicationCommunicationMetadata.name());

        assertThat(metadataList.size(), equalTo(2));
        assertThat(metadataList.stream().anyMatch((metadata) ->
                metadata.getKey().equals(MetadataKeys.MessageKeys.ERROR)
                        && metadata.getValue().equals(errorMessage)
                        && getSubject(metadata).getIdentifier().equals(failingMessageId)), equalTo(true));

        final List<Message> messageList = kafkaTestHelper.consumeValues(5, applicationCommunicationMessages.name());

        // 1 message for the conversation
        // 2 messages pending
        // 1 delivered, 1 failed
        assertThat(messageList.size(), equalTo(5));
        assertThat(messageList.stream().anyMatch((message) -> message.getDeliveryState().equals(DeliveryState.DELIVERED)
                && message.getId().equals(messageId)), equalTo(true));
        assertThat(messageList.stream().anyMatch((message) -> message.getDeliveryState().equals(DeliveryState.FAILED)
                && message.getId().equals(failingMessageId)), equalTo(true));
    }
}
