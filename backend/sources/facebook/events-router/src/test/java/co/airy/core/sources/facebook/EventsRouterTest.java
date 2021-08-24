package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceFacebookEvents;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.uuid.UUIDv5;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
class EventsRouterTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final Topic sourceFacebookEvents = new SourceFacebookEvents();
    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @Autowired
    private EventsRouter worker;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                sourceFacebookEvents,
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

    private final String eventTemplate = "{\"object\":\"page\",\"entry\":[{\"id\":\"%s\",\"time\":1550050754198," +
            "\"messaging\":[{\"sender\":{\"id\":\"%s\"},\"recipient\":{\"id\":\"%s\"},\"timestamp\":1550050753811," +
            "\"message\":{\"mid\":\"4242\",\"seq\":1362432,\"text\":\"the answer is 42\"}}]}]}";

    // This tests simulates multiple users sending messages via multiple facebook pages
    // It ensures that we create the correct number of conversations and messages
    //@Test
    void joinsAndCountsMessagesCorrectly() throws Exception {
        Random rand = new Random();
        List<String> pageIds = Arrays.asList("p1", "p2", "p3", "p4", "p5");

        List<ProducerRecord<String, String>> facebookMessageRecords = new ArrayList<>();
        Map<String, Integer> messagesPerContact = new HashMap<>();
        int totalMessages = 0;
        int usersPerPage = 5;

        for (String pageId : pageIds) {
            String channelId = UUID.randomUUID().toString();

            kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                    .setId(channelId)
                    .setConnectionState(ChannelConnectionState.CONNECTED)
                    .setSourceChannelId(pageId)
                    .setSource("facebook")
                    .setToken("")
                    .build()));

            for (int i = 0; i < usersPerPage; i++) {
                String userId = UUID.randomUUID().toString();
                int messages = rand.nextInt(4) + 2;

                final String conversationId = UUIDv5.fromNamespaceAndName(channelId, userId).toString();
                String webhookPayload = String.format(eventTemplate, pageId, userId, pageId);

                messagesPerContact.put(conversationId, messages);

                for (int j = 0; j < messages; j++) {
                    facebookMessageRecords.add(new ProducerRecord<>(sourceFacebookEvents.name(), UUID.randomUUID().toString(), webhookPayload));
                }
                totalMessages = totalMessages + messages;
            }
        }

        // Simulate messages from different people to different pages
        // somewhat close to reality
        Collections.shuffle(facebookMessageRecords);

        // Wait for the channels table to catch up
        TimeUnit.SECONDS.sleep(5);

        kafkaTestHelper.produceRecords(facebookMessageRecords);

        List<Message> messages = kafkaTestHelper.consumeValues(totalMessages, applicationCommunicationMessages.name());
        assertThat(messages, hasSize(totalMessages));

        messagesPerContact.forEach((conversationId, expectedCount) ->
                assertEquals(messages.stream().filter(m -> m.getConversationId().equals(conversationId)).count(), expectedCount.longValue())
        );
    }

    @Test
    void parsesEventsCorrectly() throws Exception {
        final String channelId = "channel-id";
        final String pageId = "page-id";

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSourceChannelId(pageId)
                .setSource("facebook")
                .build()));

        TimeUnit.SECONDS.sleep(5);

        final String messagePayload = "{\"object\":\"page\",\"entry\":[{\"id\":\"%s\",\"time\":1609250136582," +
                "\"messaging\":[{\"sender\":{\"id\":\"%s\"},\"recipient\":{\"id\":\"1912214878880084\"},\"timestamp\":1609250136503,\"message\":" +
                "{\"mid\":\"<message_id>\",\"is_echo\":true,\"text\":\"text of the message\"}}]}]}";
        final String reactionPayload = "{\"object\":\"page\",\"entry\":[{\"time\":1627396558404,\"id\":\"%s\",\"messaging\":[{\"sender\":{\"id\":\"4383398935030571\"}," +
                "\"recipient\":{\"id\":\"%s\"},\"timestamp\":1627396557502,\"reaction\":{\"mid\":\"mid\",\"action\":\"react\",\"reaction\":\"love\",\"emoji\":\"\\\\u{2764}\\\\u{FE0F}\"}}]}]}";

        kafkaTestHelper.produceRecord(new ProducerRecord<>(sourceFacebookEvents.name(), UUID.randomUUID().toString(), String.format(messagePayload, pageId, pageId)));
        kafkaTestHelper.produceRecord(new ProducerRecord<>(sourceFacebookEvents.name(), UUID.randomUUID().toString(), String.format(reactionPayload, pageId, pageId)));

        List<Message> messages = kafkaTestHelper.consumeValues(1, applicationCommunicationMessages.name());
        assertThat(messages, hasSize(1));

        Message message = messages.get(0);
        assertThat(message.getIsFromContact(), equalTo(false));
        assertThat(message.getSenderId(), equalTo("1912214878880084"));

        List<Metadata> metadataList = kafkaTestHelper.consumeValues(2, applicationCommunicationMetadata.name());
        assertThat(metadataList, hasSize(2));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.MessageKeys.Reaction.EMOJI) &&
                        metadata.getValue().equals("❤️")
        )));
    }
}
