package co.airy.core.rasa_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.rasa_connector.models.MessageSendResponse;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest(classes = AirySpringBootApplication.class)
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class MessageHandlerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    public static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private Stores stores;

    @Autowired
    private MessageHandler underTest;

    @BeforeAll
    //overloads the kafkaTestHelper.beforeAll with
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(
                sharedKafkaTestResource,
                applicationCommunicationMessages);
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Test
    public void canStoreMessageResponse() throws ExecutionException, InterruptedException, Exception {
        //given
        Message msg = getMessage();
        MessageSendResponse msgRsp = MessageSendResponse.builder().recipient_id("1").text("I'm well how are you?").build();
        //when
        underTest.writeReplyToKafka(msg, msgRsp);
        //then
        final List<ConsumerRecord<String, Message>> messageRecords = kafkaTestHelper.consumeRecords(1, applicationCommunicationMessages.name());
        final Message responseMsg = messageRecords.get(0).value();
        assertThat(responseMsg.getContent(), containsString("I'm well how are you?"));
    }

    private Message getMessage() throws Exception {
        final String Id = UUID.randomUUID().toString();
        final Message message = Message.newBuilder()
                .setId(Id)
                .setSource("test-source")
                .setSentAt(Instant.now().toEpochMilli())
                .setSenderId("test-sender-id")
                .setDeliveryState(DeliveryState.DELIVERED)
                .setConversationId("test-conversation-id")
                .setChannelId("test-channel-id")
                .setContent("{\"text\": \"Hello test!\"}")
                .setIsFromContact(true)
                .build();

        return message;
    }
}