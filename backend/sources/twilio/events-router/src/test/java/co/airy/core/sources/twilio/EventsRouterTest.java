package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceTwilioEvents;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import lombok.extern.slf4j.Slf4j;
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
import static org.junit.jupiter.api.Assertions.assertEquals;

@Slf4j
@SpringBootTest(properties = {
        "kafka.cleanup=true",
        "kafka.commit-interval-ms=100"
}, classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
class EventsRouterTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper testHelper;

    @Autowired
    private EventsRouter worker;

    private static final SourceTwilioEvents sourceTwilioEvents = new SourceTwilioEvents();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new KafkaTestHelper(sharedKafkaTestResource,
                sourceTwilioEvents,
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
        retryOnException(() -> assertEquals(worker.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canRouteTwilioMessage() throws Exception {
        String channelId = UUID.randomUUID().toString();
        String externalChannelId = "12345678";
        String sourceContactId = "987654321";

        testHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                        .setId(channelId)
                        .setSourceChannelId("whatsapp:+" + externalChannelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .setName("twilio place")
                        .setSource("twilio.whatsapp")
                        .setToken("")
                        .build())
        ));

        TimeUnit.SECONDS.sleep(5);

        String event = "ApiVersion=2010-04-01&SmsSid=SMbc31b6419de618d65076200c54676476&SmsStatus=received&SmsMessageSid=SMbc31b6419de618d65076200c54676476&NumSegments=1&To=whatsapp%3A%2B" +
                externalChannelId +
                "&From=whatsapp%3A%2B" +
                sourceContactId +
                "&MessageSid=SMbc31b6419de618d65076200c54676476&Body=Hi&AccountSid=AC64c9ab479b849275b7b50bd19540c602&NumMedia=0";

        String broken = "{\"wait\":\"this isn't url encoded ._.\"}";

        testHelper.produceRecords(
                List.of(
                        new ProducerRecord<>(sourceTwilioEvents.name(), UUID.randomUUID().toString(), event),
                        new ProducerRecord<>(sourceTwilioEvents.name(), UUID.randomUUID().toString(), broken)
                )
        );

        List<Message> messages = testHelper.consumeValues(1, applicationCommunicationMessages.name());
        assertEquals(1, messages.size(), "Expected 1 new message");
        final Message message = messages.get(0);
        assertEquals("twilio.whatsapp", message.getSource());
    }
}
