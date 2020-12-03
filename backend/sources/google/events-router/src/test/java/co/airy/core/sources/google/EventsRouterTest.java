package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceGoogleEvents;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100",
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
public class EventsRouterTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final Topic sourceGoogleEvents = new SourceGoogleEvents();
    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();

    @Autowired
    private EventsRouter worker;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                sourceGoogleEvents,
                applicationCommunicationChannels,
                applicationCommunicationMessages
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws InterruptedException {
        retryOnException(() -> assertEquals(worker.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canRouteGoogleMessages() throws Exception {
        String channelId = UUID.randomUUID().toString();
        String pageId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSourceChannelId(pageId)
                .setName("Awesome place")
                .setSource("google")
                .setToken("")
                .build()));

        // Wait for the channels table to catch up
        TimeUnit.SECONDS.sleep(5);

        final String eventPayload = "{ \"agent\": \"brands/somebrand/agents/%s\", \"conversationId\": \"CONVERSATION_ID\", \"customAgentId\": \"CUSTOM_AGENT_ID\", \"message\": { \"messageId\": \"MESSAGE_ID\", \"name\": \"conversations/CONVERSATION_ID/messages/MESSAGE_ID\", \"text\": \"MESSAGE_TEXT\", \"createTime\": \"MESSAGE_CREATE_TIME\" }, \"context\": { \"placeId\": \"LOCATION_PLACE_ID\" }, \"sendTime\": \"2014-10-02T15:01:23.045123456Z\" }";

        List<ProducerRecord<String, String>> events = List.of(new ProducerRecord<>(sourceGoogleEvents.name(), UUID.randomUUID().toString(), String.format(eventPayload, pageId)));
        kafkaTestHelper.produceRecords(events);

        List<Message> messages = kafkaTestHelper.consumeValues(1, applicationCommunicationMessages.name());
        assertThat(messages, hasSize(1));
    }
}
