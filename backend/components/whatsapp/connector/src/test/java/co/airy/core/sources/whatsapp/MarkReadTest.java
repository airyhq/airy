package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.api.Api;
import co.airy.core.sources.whatsapp.dto.MessageWithChannel;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
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
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class MarkReadTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebTestHelper webTestHelper;

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @MockBean
    private Api api;

    @Autowired
    @InjectMocks
    private Connector connector;

    @Autowired
    private Stores stores;

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
    void beforeEach() throws Exception {
        MockitoAnnotations.openMocks(this);
        retryOnException(() -> assertEquals(RUNNING, stores.getStreamState()), "Failed to reach RUNNING state.");
    }

    @Test
    void canMarkMessageRead() throws Exception {
        final String messageId = UUID.randomUUID().toString();
        final String channelId = UUID.randomUUID().toString();
        final String whatsappMessageId = "whatsapp message id";
        final Metadata metadata = newMessageMetadata(messageId, MetadataKeys.MessageKeys.Source.ID, whatsappMessageId);

        final ArgumentCaptor<String> idCaptor = ArgumentCaptor.forClass(String.class);
        doNothing().when(api).markMessageRead(idCaptor.capture(), Mockito.any(Channel.class));

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId, Message.newBuilder()
                        .setId(messageId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("source-conversation-id")
                        .setDeliveryState(DeliveryState.DELIVERED)
                        .setSource("whatsapp")
                        .setConversationId("conversationId")
                        .setHeaders(Map.of())
                        .setChannelId(channelId)
                        .setContent("hello world")
                        .setIsFromContact(true)
                        .build()),
                new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                        .setToken("token")
                        .setSourceChannelId("whatsapp-phone-number")
                        .setSource("whatsapp")
                        .setId(channelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .build()
                ),
                new ProducerRecord<>(applicationCommunicationMetadata.name(), getId(metadata).toString(), metadata)));

        retryOnException(() -> {
            final Metadata userReadMetadata = newMessageMetadata(messageId, MetadataKeys.MessageKeys.READ_BY_USER, String.valueOf(Instant.now().toEpochMilli()));
            kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationMetadata.name(), getId(userReadMetadata).toString(), userReadMetadata));
            final String actualMessageId = idCaptor.getValue();
            assertEquals(actualMessageId, whatsappMessageId);
        }, "message was not marked read");
    }
}
