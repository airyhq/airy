package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.chat_plugin.payload.MessageUpsertPayload;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static co.airy.core.chat_plugin.WebSocketController.QUEUE_MESSAGE;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.core.StringContains.containsString;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
public class ChatControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    @Autowired
    private MockMvc mvc;

    @Value("${local.server.port}")
    private int port;

    @Value("${systemToken}")
    private String systemToken;

    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();

    private static final Channel channel = Channel.newBuilder()
            .setConnectionState(ChannelConnectionState.CONNECTED)
            .setId(UUID.randomUUID().toString())
            .setSource("chatplugin")
            .setSourceChannelId("some custom identifier")
            .build();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMessages,
                applicationCommunicationChannels
        );

        kafkaTestHelper.beforeAll();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));
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
    void authenticateSendAndReceive() throws Exception {
        final String authPayload = "{\"channel_id\":\"" + channel.getId() + "\"}";

        final String response = mvc.perform(post("/chatplugin.authenticate")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .content(authPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();

        final JsonNode jsonNode = new ObjectMapper().readTree(response);
        final String token = jsonNode.get("token").textValue();

        final CompletableFuture<MessageUpsertPayload> messageFuture = subscribe(token, port, MessageUpsertPayload.class, QUEUE_MESSAGE);

        final String messageText = "answer is 42";
        String sendMessagePayload = "{\"message\": { \"text\": \"" + messageText + "\", \"type\":\"text\" }}";
        mvc.perform(post("/chatplugin.send")
                .headers(buildHeaders(token))
                .content(sendMessagePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.text", is(messageText)));

        final MessageUpsertPayload messageUpsertPayload = messageFuture.get();

        assertNotNull(messageUpsertPayload);
        Map<String, Object> node = (Map<String, Object>) messageUpsertPayload.getMessage().getContent();
        assertThat(node.get("text").toString(), containsString(messageText));
    }

    @Test
    void canResumeConversation() throws Exception {
        final String authPayload = "{\"channel_id\":\"" + channel.getId() + "\"}";

        String response = mvc.perform(post("/chatplugin.authenticate")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .content(authPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();
        JsonNode jsonNode = new ObjectMapper().readTree(response);
        final String authToken = jsonNode.get("token").textValue();

        final String messageText = "Talk to you later!";
        final String sendMessagePayload = "{\"message\":{\"text\":\"" + messageText + "\"}}";
        mvc.perform(post("/chatplugin.send")
                .headers(buildHeaders(authToken))
                .content(sendMessagePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.delivery_state", is("delivered")))
                .andExpect(jsonPath("$.content.text", containsString(messageText)));

        response = mvc.perform(post("/chatplugin.resumeToken")
                .headers(buildHeaders(authToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resume_token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();
        jsonNode = new ObjectMapper().readTree(response);
        final String resumeToken = jsonNode.get("resume_token").textValue();


        retryOnException(() -> {
            final String resumePayload = "{\"resume_token\":\"" + resumeToken + "\"}";
            mvc.perform(post("/chatplugin.authenticate")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .content(resumePayload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token", is(not(nullValue()))))
                    .andExpect(jsonPath("$.messages", hasSize(1)))
                    .andExpect(jsonPath("$.messages[0].content.text", containsString(messageText)));
        }, "Did not resume conversation");
    }


    @Test
    void canGetResumeTokenAsUser() throws Exception {
        final String requestPayload = String.format("{\"conversation_id\":\"c-id\",\"channel_id\":\"%s\"}", channel.getId());

        String response = mvc.perform(post("/chatplugin.resumeToken")
                .headers(buildHeaders(systemToken))
                .content(requestPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resume_token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();
        JsonNode jsonNode = new ObjectMapper().readTree(response);
        final String resumeToken = jsonNode.get("resume_token").textValue();

        retryOnException(() -> {
            final String resumePayload = "{\"resume_token\":\"" + resumeToken + "\"}";
            mvc.perform(post("/chatplugin.authenticate")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .content(resumePayload))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token", is(not(nullValue()))))
                    .andExpect(jsonPath("$.messages", hasSize(0)));
        }, "Did not resume conversation");
    }

    private HttpHeaders buildHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        headers.setBearerAuth(token);
        return headers;
    }

    public StompSession connect(String jwtToken, int port) throws ExecutionException, InterruptedException {
        final WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());

        MappingJackson2MessageConverter messageConverter = new MappingJackson2MessageConverter();
        ObjectMapper objectMapper = new ObjectMapper().setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        messageConverter.setObjectMapper(objectMapper);
        stompClient.setMessageConverter(messageConverter);

        StompHeaders connectHeaders = new StompHeaders();
        connectHeaders.add(WebSocketHttpHeaders.AUTHORIZATION, "Bearer " + jwtToken);

        WebSocketHttpHeaders httpHeaders = new WebSocketHttpHeaders();

        return stompClient.connect("ws://localhost:" + port + "/ws.chatplugin", httpHeaders, connectHeaders, new StompSessionHandlerAdapter() {
        }).get();
    }

    public <T> CompletableFuture<T> subscribe(String jwtToken, int port, Class<T> payloadType, String topic) throws ExecutionException, InterruptedException {
        final StompSession stompSession = connect(jwtToken, port);

        final CompletableFuture<T> completableFuture = new CompletableFuture<>();

        stompSession.subscribe("/user" + topic, new StompSessionHandlerAdapter() {
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
