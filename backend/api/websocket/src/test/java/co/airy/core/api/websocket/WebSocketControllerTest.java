package co.airy.core.api.websocket;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.websocket.payload.ChannelEvent;
import co.airy.core.api.websocket.payload.MessageEvent;
import co.airy.core.api.websocket.payload.MetadataEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.jwt.Jwt;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.time.Instant;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static co.airy.core.api.websocket.WebSocketController.QUEUE_EVENTS;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {AirySpringBootApplication.class})
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
public class WebSocketControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();


    @Value("${local.server.port}")
    private int port;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private Jwt jwt;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata
        );
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        retryOnException(() -> mvc.perform(get("/actuator/health")).andExpect(status().isOk()), "Application is not healthy");
    }

    @Test
    void canReceiveMessageEvents() throws Exception {
        final CompletableFuture<MessageEvent> messageFuture = subscribe(port, MessageEvent.class, QUEUE_EVENTS, jwt);
        final CompletableFuture<ChannelEvent> channelFuture = subscribe(port, ChannelEvent.class, QUEUE_EVENTS, jwt);
        final CompletableFuture<MetadataEvent> metadataFuture = subscribe(port, MetadataEvent.class, QUEUE_EVENTS, jwt);

        final Message message = Message.newBuilder()
                .setId("messageId")
                .setSource("facebook")
                .setSentAt(Instant.now().toEpochMilli())
                .setUpdatedAt(null)
                .setSenderId("sourceConversationId")
                .setSenderType(SenderType.APP_USER)
                .setDeliveryState(DeliveryState.DELIVERED)
                .setConversationId("conversationId")
                .setChannelId("channelId")
                .setContent("{\"text\":\"hello world\"}")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message));

        MessageEvent recMessage = messageFuture.get(30, TimeUnit.SECONDS);
        assertNotNull(recMessage);
        assertThat(recMessage.getPayload().getChannelId(), equalTo(message.getChannelId()));
        assertThat(recMessage.getPayload().getMessage().getId(), equalTo(message.getId()));
        assertThat(recMessage.getPayload().getMessage().getContent(), equalTo(message.getContent()));
    }

    private static StompSession connectToWs(int port, Jwt jwt) throws ExecutionException, InterruptedException {
        final WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        MappingJackson2MessageConverter messageConverter = new MappingJackson2MessageConverter();
        ObjectMapper objectMapper = new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        messageConverter.setObjectMapper(objectMapper);
        stompClient.setMessageConverter(messageConverter);

        StompHeaders connectHeaders = new StompHeaders();
        WebSocketHttpHeaders httpHeaders = new WebSocketHttpHeaders();
        connectHeaders.add(AUTHORIZATION, "Bearer " + jwt.tokenFor("userId"));

        return stompClient.connect("ws://localhost:" + port + "/ws.events", httpHeaders, connectHeaders, new StompSessionHandlerAdapter() {
        }).get();
    }

    public static <T> CompletableFuture<T> subscribe(int port, Class<T> payloadType, String topic, Jwt jwt) throws ExecutionException, InterruptedException {
        final StompSession stompSession = connectToWs(port, jwt);

        final CompletableFuture<T> completableFuture = new CompletableFuture<>();

        stompSession.subscribe(topic, new StompSessionHandlerAdapter() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return payloadType;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                completableFuture.complete((T) payload);
            }
        });

        return completableFuture;
    }
}
