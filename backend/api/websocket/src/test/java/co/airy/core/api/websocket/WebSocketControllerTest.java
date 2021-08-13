package co.airy.core.api.websocket;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Tag;
import co.airy.avro.communication.TagColor;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.event.payload.ChannelUpdated;
import co.airy.model.event.payload.MessageUpdated;
import co.airy.model.event.payload.MetadataUpdated;
import co.airy.model.event.payload.TagEvent;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
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
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static co.airy.core.api.websocket.WebSocketController.QUEUE_EVENTS;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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
    private static final ApplicationCommunicationTags applicationCommunicationTags = new ApplicationCommunicationTags();

    @Value("${local.server.port}")
    private int port;

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels,
                applicationCommunicationMetadata,
                applicationCommunicationTags
        );
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canSendMessageEvents() throws Exception {
        final CompletableFuture<MessageUpdated> future = subscribe(port, MessageUpdated.class, QUEUE_EVENTS);
        final Message message = Message.newBuilder()
                .setId("messageId")
                .setSource("facebook")
                .setSentAt(Instant.now().toEpochMilli())
                .setUpdatedAt(null)
                .setSenderId("sourceConversationId")
                .setDeliveryState(DeliveryState.DELIVERED)
                .setConversationId("conversationId")
                .setChannelId("channelId")
                .setContent("{\"text\":\"hello world\"}")
                .setIsFromContact(true)
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message));

        MessageUpdated recMessage = future.get(30, TimeUnit.SECONDS);
        assertNotNull(recMessage);
        assertThat(recMessage.getPayload().getChannelId(), equalTo(message.getChannelId()));
        assertThat(recMessage.getPayload().getMessage().getId(), equalTo(message.getId()));
        Map<String, Object> node = (Map<String, Object>) recMessage.getPayload().getMessage().getContent();
        assertThat(node.get("text").toString(), containsString("hello world"));
    }

    @Test
    void canSendChannelEvents() throws Exception {
        final CompletableFuture<ChannelUpdated> future = subscribe(port, ChannelUpdated.class, QUEUE_EVENTS);

        final Channel channel = Channel.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSource("sourceIdentifier")
                .setSourceChannelId("sourceChannelId")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));

        ChannelUpdated recChannel = future.get(30, TimeUnit.SECONDS);
        assertNotNull(recChannel);
        assertThat(recChannel.getPayload().getId(), equalTo(channel.getId()));
    }

    @Test
    void canSendMetadataEvents() throws Exception {
        final CompletableFuture<MetadataUpdated> future = subscribe(port, MetadataUpdated.class, QUEUE_EVENTS);

        final Metadata metadata = Metadata.newBuilder()
                .setKey("contact.displayName")
                .setValue("Grace")
                .setSubject("conversation:123")
                .setTimestamp(Instant.now().toEpochMilli())
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationMetadata.name(), "metadataId", metadata));

        MetadataUpdated recMetadata = future.get(30, TimeUnit.SECONDS);
        assertNotNull(recMetadata);
        assertThat(recMetadata.getPayload().getSubject(), equalTo("conversation"));
        assertThat(recMetadata.getPayload().getIdentifier(), equalTo("123"));
        assertThat(recMetadata.getPayload().getMetadata().get("contact").get("displayName").textValue(), equalTo(metadata.getValue()));
    }

    @Test
    void canSendTagEvents() throws Exception {
        final CompletableFuture<TagEvent> future = subscribe(port, TagEvent.class, QUEUE_EVENTS);

        String tagId=UUID.randomUUID().toString();
        final Tag tag = Tag.newBuilder()
                .setId(tagId)
                .setName("flag")
                .setColor(TagColor.RED)
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationTags.name(), tagId, tag));

        TagEvent tagEvent = future.get(30, TimeUnit.SECONDS);
        assertNotNull(tagEvent);
        assertThat(tagEvent.getPayload().getId(), equalTo(tagId));
        assertThat(tagEvent.getPayload().getName(), equalTo("flag"));
        assertThat(tagEvent.getPayload().getColor(), equalTo("tag-red"));
    }

    private static StompSession connectToWs(int port) throws ExecutionException, InterruptedException {
        final WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        MappingJackson2MessageConverter messageConverter = new MappingJackson2MessageConverter();
        ObjectMapper objectMapper = new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        messageConverter.setObjectMapper(objectMapper);
        stompClient.setMessageConverter(messageConverter);

        StompHeaders connectHeaders = new StompHeaders();
        WebSocketHttpHeaders httpHeaders = new WebSocketHttpHeaders();

        return stompClient.connect("ws://localhost:" + port + "/ws.communication", httpHeaders, connectHeaders, new StompSessionHandlerAdapter() {
        }).get();
    }

    public static <T> CompletableFuture<T> subscribe(int port, Class<T> payloadType, String topic) throws ExecutionException, InterruptedException {
        final StompSession stompSession = connectToWs(port);

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
