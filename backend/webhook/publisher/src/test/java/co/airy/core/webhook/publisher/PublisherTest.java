package co.airy.core.webhook.publisher;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.webhook.WebhookEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.event.payload.EventType;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.avro.specific.SpecificRecord;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class PublisherTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationWebhooks applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMetadata,
                applicationCommunicationMessages,
                applicationCommunicationWebhooks,
                applicationCommunicationChannels
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Autowired
    @InjectMocks
    Stores stores;

    @MockBean
    private BeanstalkPublisher beanstalkPublisher;

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.openMocks(this);
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canPublishMessageToQueue() throws Exception {
        ArgumentCaptor<WebhookEvent> batchCaptor = ArgumentCaptor.forClass(WebhookEvent.class);
        doNothing().when(beanstalkPublisher).publishMessage(batchCaptor.capture());

        final Webhook acceptAll = Webhook.newBuilder()
                .setEndpoint("http://endpoint.com/accept")
                .setId(UUID.randomUUID().toString())
                .setStatus(Status.Subscribed)
                .setSubscribedAt(Instant.now().toEpochMilli())
                .build();

        final Webhook selective = Webhook.newBuilder()
                .setEndpoint("http://endpoint.com/selective")
                .setEvents(List.of(
                        EventType.MESSAGE_CREATED.getEventType(),
                        EventType.CONVERSATION_UPDATED.getEventType()
                ))
                .setId(UUID.randomUUID().toString())
                .setStatus(Status.Subscribed)
                .setSubscribedAt(Instant.now().toEpochMilli())
                .build();

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationWebhooks.name(), acceptAll.getId(), acceptAll),
                new ProducerRecord<>(applicationCommunicationWebhooks.name(), selective.getId(), selective)
        ));

        List<ProducerRecord<String, SpecificRecord>> records = new ArrayList<>();

        final String conversationId = UUID.randomUUID().toString();
        int count = 4;
        for (int i = 0; i < count; i++) {
            final String messageId = "message-" + i;

            long now = Instant.now().toEpochMilli();
            // message.created
            records.add(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                    Message.newBuilder()
                            .setId(messageId)
                            .setSource("facebook")
                            .setSentAt(now)
                            .setUpdatedAt(null)
                            .setSenderId("sourceConversationId")
                            .setIsFromContact(false)
                            .setDeliveryState(DeliveryState.DELIVERED)
                            .setConversationId(conversationId)
                            .setChannelId("channelId")
                            .setContent("{\"text\":\"hello world\"}")
                            .build()));

            // message.updated
            records.add(new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                    Message.newBuilder()
                            .setId(messageId)
                            .setSource("facebook")
                            .setSentAt(now)
                            .setUpdatedAt(now) // field presence identifies record as an update
                            .setSenderId("sourceConversationId")
                            .setIsFromContact(false)
                            .setDeliveryState(DeliveryState.DELIVERED)
                            .setConversationId(conversationId)
                            .setChannelId("channelId")
                            .setContent("{\"text\":\"hello world\"}")
                            .build())
            );
        }

        // channel.updated
        records.add(new ProducerRecord<>(applicationCommunicationChannels.name(), UUID.randomUUID().toString(),
                Channel.newBuilder()
                        .setId(UUID.randomUUID().toString())
                        .setSource("source")
                        .setSourceChannelId("source channel id")
                        .setConnectionState(ChannelConnectionState.CONNECTED).build()
        ));

        retryOnException(() -> assertThat(stores.getAllWebhooks(), hasSize(2)), "Webhooks store did not get ready");
        kafkaTestHelper.produceRecords(records);

        retryOnException(() -> {
            final List<WebhookEvent> allEvents = batchCaptor.getAllValues().stream().filter((webhookEvent) -> webhookEvent.getWebhookId().equals(acceptAll.getId())).collect(Collectors.toList());
            final List<WebhookEvent> selectiveEvents = batchCaptor.getAllValues().stream().filter((webhookEvent) -> webhookEvent.getWebhookId().equals(selective.getId())).collect(Collectors.toList());

            assertThat(allEvents.stream().filter((webhookEvent) -> webhookEvent.getPayload().getTypeId().equals(EventType.CHANNEL_UPDATED)).count(), equalTo(1L));
            assertThat(allEvents.stream().filter((webhookEvent) -> webhookEvent.getPayload().getTypeId().equals(EventType.MESSAGE_CREATED)).count(), equalTo(Long.valueOf(count)));

            assertTrue(selectiveEvents.stream().allMatch((webhookEvent) -> selective.getEvents().contains(webhookEvent.getPayload().getType())));
            assertTrue(selectiveEvents.stream().anyMatch((webhookEvent) -> webhookEvent.getPayload().getTypeId().equals(EventType.MESSAGE_CREATED)));
            assertTrue(selectiveEvents.stream().anyMatch((webhookEvent) -> webhookEvent.getPayload().getTypeId().equals(EventType.CONVERSATION_UPDATED)));
        }, "Number of delivered message is incorrect");
    }
}
