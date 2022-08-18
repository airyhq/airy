package co.airy.core.rasa_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.rasa_connector.models.MessageSend;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
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
import org.mockito.ArgumentCaptor;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.UUID;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class RasaConnectorServiceTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    public static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static KafkaTestHelper kafkaTestHelper;

    @MockBean
    RasaClient rasaClient;

    @Autowired
    Stores stores;

    @BeforeAll
    //overloads the kafkaTestHelper.beforeAll with
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, applicationCommunicationMessages);
        kafkaTestHelper.beforeAll();
    }

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.openMocks(this);
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Test
    public void callsRasaClientSendWhenMessageIsValid() throws Exception {
        //given
        String textMessage = "Hello from Airy";
        sendMessage(textMessage);
        //when
        ArgumentCaptor<MessageSend> msgArgumentCaptor = ArgumentCaptor.forClass(MessageSend.class);
        //then
        retryOnException(() -> {
            verify(rasaClient).sendMessage(msgArgumentCaptor.capture());
            //then
            //grab the argument sent through rasaClient and check it is correct
            MessageSend sentMessage = msgArgumentCaptor.getValue();
            assertThat(sentMessage.getMessage(), equalTo(textMessage));
        }, "message was not created");
    }

    private Message sendMessage(String text) throws Exception {
        final String Id = UUID.randomUUID().toString();
        final Message message = Message.newBuilder().setId(Id).setSource("test-source").setSentAt(Instant.now().toEpochMilli()).setSenderId("test-sender-id").setDeliveryState(DeliveryState.DELIVERED).setConversationId("test-conversation-id").setChannelId("test-channel-id").setContent(String.format("{\"text\": \"%s\"}", text)).setIsFromContact(true).build();
        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationMessages.name(), Id, message));
        return message;
    }
}
