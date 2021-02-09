package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceGoogleEvents;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class EventsRouterTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final Topic sourceGoogleEvents = new SourceGoogleEvents();
    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @Autowired
    private EventsRouter worker;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                sourceGoogleEvents,
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
        retryOnException(() -> assertEquals(worker.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canRouteGoogleMessages() throws Exception {
        String channelId = UUID.randomUUID().toString();
        String agentId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSourceChannelId(agentId)
                .setSource("google")
                .build()));

        // Wait for the channels table to catch up
        TimeUnit.SECONDS.sleep(5);

        final String eventPayload = "{ \"agent\": \"brands/somebrand/agents/%s\", \"conversationId\": \"CONVERSATION_ID\", \"customAgentId\": \"CUSTOM_AGENT_ID\", \"message\": { \"messageId\": \"MESSAGE_ID\", \"name\": \"conversations/CONVERSATION_ID/messages/MESSAGE_ID\", \"text\": \"MESSAGE_TEXT\", \"createTime\": \"MESSAGE_CREATE_TIME\" }, \"context\": { \"placeId\": \"LOCATION_PLACE_ID\" }, \"sendTime\": \"2014-10-02T15:01:23.045123456Z\" }";

        List<ProducerRecord<String, String>> events = List.of(new ProducerRecord<>(sourceGoogleEvents.name(), UUID.randomUUID().toString(), String.format(eventPayload, agentId)));
        kafkaTestHelper.produceRecords(events);

        List<Message> messages = kafkaTestHelper.consumeValues(1, applicationCommunicationMessages.name());
        assertThat(messages, hasSize(1));
    }

    @Test
    void canRouteGoogleMetadata() throws Exception {
        String channelId = UUID.randomUUID().toString();
        String agentId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSourceChannelId(agentId)
                .setSource("google")
                .build()));

        // Wait for the channels table to catch up
        TimeUnit.SECONDS.sleep(5);

        final String displayName = "Grace Brewster Murray Hopper";
        final String singleName = "hal9000";

        // Two different event types that both carry context
        final String messagePayload = "{\"agent\":\"brands/somebrand/agents/%s\",\"conversationId\":\"CONVERSATION_ID\"," +
                "\"customAgentId\":\"CUSTOM_AGENT_ID\",\"message\":{\"messageId\":\"MESSAGE_ID\",\"name\":\"conversations/CONVERSATION_ID/messages/MESSAGE_ID\",\"text\":\"MESSAGE_TEXT\",\"createTime\":\"MESSAGE_CREATE_TIME\"}," +
                "\"context\":{\"userInfo\":{\"displayName\":\"%s\"}},\"sendTime\":\"2014-10-02T15:01:23.045123456Z\"}";
        final String userStatusPayload = "{\"agent\":\"brands/somebrand/agents/%s\",\"conversationId\":\"CONVERSATION_ID\"," +
                "\"customAgentId\":\"CUSTOM_AGENT_ID\",\"userStatus\":{\"isTyping\":true}," +
                "\"context\":{\"userInfo\":{\"displayName\":\"%s\"}},\"sendTime\":\"2014-10-02T15:01:23.045123456Z\"}";

        List<ProducerRecord<String, String>> events = List.of(
                new ProducerRecord<>(sourceGoogleEvents.name(), UUID.randomUUID().toString(), String.format(messagePayload, agentId, displayName)),
                new ProducerRecord<>(sourceGoogleEvents.name(), UUID.randomUUID().toString(), String.format(userStatusPayload, agentId, singleName))
        );

        kafkaTestHelper.produceRecords(events);

        List<Metadata> metadataList = kafkaTestHelper.consumeValues(3, applicationCommunicationMetadata.name());
        assertThat(metadataList, hasSize(3));

        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.ConversationKeys.Contact.FIRST_NAME) &&
                        metadata.getValue().equals(singleName)
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.ConversationKeys.Contact.FIRST_NAME) &&
                        metadata.getValue().equals("Grace")
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.ConversationKeys.Contact.LAST_NAME) &&
                        metadata.getValue().equals("Brewster Murray Hopper")
        )));
    }
}
