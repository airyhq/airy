package co.airy.core.webhook.publisher;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.webhook.publisher.model.QueueMessage;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;

@Tag("kafka-integration")
@SpringBootTest(properties = {
        "kafka.cleanup=true",
        "kafka.cache.max.bytes=0",
        "kafka.commit-interval-ms=100",
        "redis.url=no",
        "redis.port=10",
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
public class PublisherTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationWebhooks,
                applicationCommunicationMessages
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }


    @Autowired
    @InjectMocks
    Publisher publisher;

    @MockBean
    private RedisQueue redisQueue;

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.initMocks(this);
        retryOnException(() -> assertEquals(publisher.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canPublishMessageToQueue() throws Exception {
        kafkaTestHelper.produceRecord(
                new ProducerRecord<>(applicationCommunicationWebhooks.name(), "339ab777-92aa-43a5-b452-82e73c50fc59",
                        Webhook.newBuilder()
                                .setApiSecret("such secret")
                                .setEndpoint("http://somesalesforce.com/form")
                                .setHeaders(Map.of())
                                .setId("339ab777-92aa-43a5-b452-82e73c50fc59")
                                .setStatus(Status.Subscribed)
                                .build()
                ));

        TimeUnit.SECONDS.sleep(2);

        ArgumentCaptor<QueueMessage> batchCaptor = ArgumentCaptor.forClass(QueueMessage.class);
        doNothing().when(redisQueue).publishMessage(Mockito.anyString(), batchCaptor.capture());

        List<ProducerRecord<String, Message>> messages = new ArrayList<>();

        int count = 4;
        for (int i = 0; i < count; i++) {
            final String messageId = "message-" + i;

            long now = Instant.now().toEpochMilli();
            messages.add(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                    Message.newBuilder()
                            .setId(messageId)
                            .setSource("facebook")
                            .setSentAt(now)
                            .setUpdatedAt(null)
                            .setSenderId("sourceConversationId")
                            .setSenderType(SenderType.APP_USER)
                            .setDeliveryState(DeliveryState.DELIVERED)
                            .setConversationId("conversationId")
                            .setChannelId("channelId")
                            .setContent("{\"text\":\"hello world\"}")
                            .build())
            );

            // Don't publish the message update
            messages.add(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                    Message.newBuilder()
                            .setId(messageId)
                            .setSource("facebook")
                            .setSentAt(now)
                            .setUpdatedAt(now) // field presence identifies message as update
                            .setSenderId("sourceConversationId")
                            .setSenderType(SenderType.APP_USER)
                            .setDeliveryState(DeliveryState.DELIVERED)
                            .setConversationId("conversationId")
                            .setChannelId("channelId")
                            .setContent("{\"text\":\"hello world\"}")
                            .build())
            );
        }

        kafkaTestHelper.produceRecords(messages);

        retryOnException(() -> {
            final List<QueueMessage> allMessages = batchCaptor.getAllValues();
            assertEquals(4, allMessages.size());
        }, "Number of delivered message is incorrect");
    }
}
