package co.airy.core.sources.viber;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.sources.viber.dto.SendMessageResponse;
import co.airy.core.sources.viber.lib.MockAccountInfo;
import co.airy.core.sources.viber.lib.Topics;
import co.airy.core.sources.viber.services.Api;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@Import(MockAccountInfo.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class SendMessageTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper testHelper;

    @Autowired
    @MockBean
    private Api api;

    @Autowired
    @InjectMocks
    private Connector connector;

    @BeforeAll
    static void beforeAll() throws Exception {
        testHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
        testHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        testHelper.afterAll();
    }

    @Test
    void sendsMessage() throws Exception {
        final String conversationId = "conversationId";
        final String messageId = "message-id";
        final Long messageToken = 123L;
        final String sourceConversationId = "9MVsH/2gRPr6pP72Eb6aXw==";
        final String content = "{\"type\":\"text\",\"text\":\"Hello\"}";

        ArgumentCaptor<String> receiverCaptor = ArgumentCaptor.forClass(String.class);
        when(api.sendMessage(receiverCaptor.capture(), Mockito.any(), eq(content)))
                .thenReturn(new SendMessageResponse(0, "ok", messageToken));

        testHelper.produceRecords(List.of(
                new ProducerRecord<>(Topics.applicationCommunicationMessages.name(), "other-message-id",
                        Message.newBuilder()
                                .setId("other-message-id")
                                .setSource("viber")
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId(sourceConversationId)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId(conversationId)
                                .setChannelId("channelId")
                                .setContent("{\"text\":\"Hello world\"}")
                                .setIsFromContact(true)
                                .build())
        ));

        TimeUnit.SECONDS.sleep(5);

        testHelper.produceRecord(new ProducerRecord<>(Topics.applicationCommunicationMessages.name(), messageId,
                Message.newBuilder()
                        .setId(messageId)
                        .setSentAt(Instant.now().toEpochMilli())
                        .setSenderId("user-id")
                        .setDeliveryState(DeliveryState.PENDING)
                        .setConversationId(conversationId)
                        .setChannelId("channelId")
                        .setSource("viber")
                        .setContent(content)
                        .setIsFromContact(false)
                        .build())
        );

        retryOnException(() -> {
            assertThat(receiverCaptor.getValue(), equalTo(sourceConversationId));
        }, "Viber API was not called");
    }
}
