package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.schema.source.SourceFacebookTransformedEvents;
import co.airy.kafka.test.TestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.uuid.UUIDV5;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100",
        "facebook.app-id=12345"
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
class EventsRouterTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static TestHelper testHelper;

    private static final Topic sourceFacebookEvents = new SourceFacebookEvents();
    private static final Topic sourceFacebookTransformedEvents = new SourceFacebookTransformedEvents();
    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();

    @Autowired
    private EventsRouter worker;

    private static boolean streamInitialized = false;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new TestHelper(sharedKafkaTestResource,
                sourceFacebookEvents,
                sourceFacebookTransformedEvents,
                applicationCommunicationChannels,
                applicationCommunicationMessages
        );

        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws InterruptedException {
        if (!streamInitialized) {

            testHelper.waitForCondition(() -> assertEquals(worker.getStreamState(), RUNNING), "Failed to reach RUNNING state.");

            streamInitialized = true;
        }
    }

    private final String eventTemplate = "{\"object\":\"page\",\"entry\":[{\"id\":\"%s\",\"time\":1550050754198,\"messaging\":[{\"sender\":{\"id\":\"%s\"},\"recipient\":{\"id\":\"%s\"},\"timestamp\":1550050753811,\"message\":{\"mid\":\"4242\",\"seq\":1362432,\"text\":\"the answer is 42\"}}]}]}";

    // This tests simulates multiple users sending messages via multiple facebook pages
    // It ensures that we create the correct number of conversations and messages
    @Test
    void joinsAndCountsMessagesCorrectly() throws Exception {
        Random rand = new Random();
        List<String> pageIds = Arrays.asList("p1", "p2", "p3", "p4", "p5");

        List<ProducerRecord<String, String>> facebookMessageRecords = new ArrayList<>();
        Map<String, Integer> messagesPerContact = new HashMap<>();
        int totalMessages = 0;
        int usersPerPage = 5;

        for (String pageId : pageIds) {
            String channelId = UUID.randomUUID().toString();

            testHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                    .setId(channelId)
                    .setConnectionState(ChannelConnectionState.CONNECTED)
                    .setSourceChannelId(pageId)
                    .setName("fb-page-a")
                    .setSource("facebook")
                    .setToken("")
                    .build()));

            for (int i = 0; i < usersPerPage; i++) {
                String userId = UUID.randomUUID().toString();
                int nMessages = rand.nextInt(4) + 2;

                final String conversationId = UUIDV5.fromNamespaceAndName(channelId, userId).toString();
                String webhookPayload = String.format(eventTemplate, pageId, userId, pageId);

                messagesPerContact.put(conversationId, nMessages);

                for (int j = 0; j < nMessages; j++) {
                    facebookMessageRecords.add(new ProducerRecord<>(sourceFacebookEvents.name(), UUID.randomUUID().toString(), webhookPayload));
                }
                totalMessages = totalMessages + nMessages;
            }
        }

        // Simulate messages from different people to different pages
        // somewhat close to reality
        Collections.shuffle(facebookMessageRecords);

        // Wait for the channels table to catch up
        TimeUnit.SECONDS.sleep(5);

        testHelper.produceRecords(facebookMessageRecords);

        List<Message> messages = testHelper.consumeValues(totalMessages, applicationCommunicationMessages.name());
        assertThat(messages, hasSize(totalMessages));

        messagesPerContact.forEach((conversationId, expectedCount) -> {
            assertEquals(messages.stream().filter(m -> m.getConversationId().equals(conversationId)).count(), expectedCount.longValue());
        });

    }
}
