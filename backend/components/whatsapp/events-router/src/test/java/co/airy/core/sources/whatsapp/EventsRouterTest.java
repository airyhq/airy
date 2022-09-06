package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceWhatsappEvents;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.CoreMatchers.equalTo;
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

    private static final Topic sourceWhatsappEvents = new SourceWhatsappEvents();
    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @Autowired
    private EventsRouter worker;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                sourceWhatsappEvents,
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

    final String sourceChannelId = "103874789095437";
    final String channelId = "channel-id";
    boolean channelCreated = false;

    @BeforeEach
    void beforeEach() throws Exception {

        retryOnException(() -> assertEquals(worker.getStreamState(), RUNNING), "Failed to reach RUNNING state.");

        if (!channelCreated) {
            kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                    .setId(channelId)
                    .setConnectionState(ChannelConnectionState.CONNECTED)
                    .setSourceChannelId(sourceChannelId)
                    .setSource("whatsapp")
                    .build()));
            channelCreated = true;
            TimeUnit.SECONDS.sleep(5);
        }
    }


    @Test
    void routesEvents() throws Exception {
        routesMessage();
    }

    void routesMessage() throws Exception {
        final String messagePayload = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("text.json"), StandardCharsets.UTF_8);

        kafkaTestHelper.produceRecord(new ProducerRecord<>(sourceWhatsappEvents.name(), UUID.randomUUID().toString(), String.format(messagePayload)));

        retryOnException(() -> {
            List<Message> messages = kafkaTestHelper.consumeValues(1, applicationCommunicationMessages.name());
            assertThat(messages, hasSize(1));

            final JsonNode jsonNode = new ObjectMapper().readTree(messagePayload);
            final JsonNode messageNode = jsonNode.get("entry").get(0).get("changes").get(0).get("value").get("messages").get(0);

            Message message = messages.get(0);
            assertThat(message.getIsFromContact(), equalTo(true));
            assertThat(message.getSource(), equalTo("whatsapp"));
            assertThat(message.getSenderId(), equalTo(messageNode.get("from").asText()));
        }, "message was not routed");

        List<Metadata> metadataList = kafkaTestHelper.consumeValues(1, applicationCommunicationMetadata.name());
        assertThat(metadataList, hasSize(1));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME) &&
                        metadata.getValue().equals("Ada Lovelace")
        )));
    }
}
