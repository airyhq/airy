package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.communication.util.TestConversation;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static co.airy.core.api.communication.util.Topics.applicationCommunicationChannels;
import static co.airy.core.api.communication.util.Topics.getTopics;
import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.core.Is.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class ConversationsNoteTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, getTopics());
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
    void canAddDeleteNote() throws Exception {
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(UUID.randomUUID().toString())
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));
        final String conversationId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, 1));

        retryOnException(() -> webTestHelper.post("/conversations.info",
                "{\"conversation_id\":\"" + conversationId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(conversationId))), "Conversation was not created");

        final String text = "This is a test note";

        webTestHelper.post("/conversations.addNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"" + text + "\"}")
                .andExpect(status().isNoContent());

        final String[] content = {""};

        retryOnException(
                () -> {
                    MvcResult res = webTestHelper.post("/conversations.info",
                                    "{\"conversation_id\":\"" + conversationId + "\"}")
                            .andExpect(status().isOk())
                            .andExpect(status().isOk())
                            .andExpect(jsonPath("$.id", is(conversationId)))
                            .andExpect(jsonPath("$.metadata.notes", is(not(nullValue()))))
                            .andReturn();
                    content[0] = res.getResponse().getContentAsString();
                },
                "Note was not added");

        String noteKey = "";
        Pattern pattern = Pattern.compile("(\"notes\":\\{\"){1}([a-z0-9-]*)(\":\"){1}");
        Matcher matcher = pattern.matcher(content[0]);
        if (matcher.find()) {
            noteKey = matcher.group(2);
        }

        String finalNoteKey = noteKey;

        webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(conversationId)))
                .andExpect(jsonPath(String.format("$.metadata.notes['%s']", finalNoteKey), is(text)));

        webTestHelper.post("/conversations.deleteNote",
                        "{\"conversation_id\":\"" + UUID.fromString(conversationId) + "\",\"note_id\":\"" + UUID.fromString(finalNoteKey) + "\"}")
                .andExpect(status().isNoContent());

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                                    "{\"conversation_id\":\"" + conversationId + "\"}")
                            .andExpect(status().isOk())
                            .andExpect(jsonPath("$.id", is(conversationId)))
                            .andExpect(jsonPath("$.metadata.notes").doesNotExist())
                            .andReturn(),
                "Note is not removed"
        );
    }

    @Test
    void canAddUpdateNote() throws Exception {
        final Channel channel = Channel.newBuilder()
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setId(UUID.randomUUID().toString())
                .setSource("facebook")
                .setSourceChannelId("ps-id")
                .build();

        kafkaTestHelper.produceRecord(new ProducerRecord<>(applicationCommunicationChannels.name(), channel.getId(), channel));
        final String conversationId = UUID.randomUUID().toString();
        kafkaTestHelper.produceRecords(TestConversation.generateRecords(conversationId, channel, 1));

        retryOnException(() -> webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(conversationId))), "Conversation was not created");

        final String text = "This is a test note";
        final String[] content = {""};

        webTestHelper.post("/conversations.addNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"" + text + "\"}")
                .andExpect(status().isNoContent());

        retryOnException(
                () -> {
                    MvcResult res = webTestHelper.post("/conversations.info",
                                    "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"" + text + "\"}")
                            .andExpect(status().isOk())
                            .andExpect(status().isOk())
                            .andExpect(jsonPath("$.id", is(conversationId)))
                            .andExpect(jsonPath("$.metadata.notes", is(not(nullValue()))))
                            .andReturn();
                    content[0] = res.getResponse().getContentAsString();
                },
                "Note was not added");

        String noteKey = "";
        Pattern pattern = Pattern.compile("(\"notes\":\\{\"){1}([a-z0-9-]*)(\":\"){1}");
        Matcher matcher = pattern.matcher(content[0]);
        if (matcher.find()) {
            noteKey = matcher.group(2);
        }
        final String finalNoteKey = noteKey;

        webTestHelper.post("/conversations.info",
                        "{\"conversation_id\":\"" + conversationId + "\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(conversationId)))
                .andExpect(jsonPath(String.format("$.metadata.notes['%s']", finalNoteKey), is(text)));

        final String newText = "This is updated text";

        webTestHelper.post("/conversations.updateNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"" + newText + "\",\"note_id\":\"" + noteKey + "\"}")
                .andExpect(status().isNoContent());

        retryOnException(
                () -> webTestHelper.post("/conversations.info",
                                    "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"" + text + "\"}")
                        .andExpect(status().isOk())
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.id", is(conversationId)))
                        .andExpect(jsonPath(String.format("$.metadata.notes['%s']", finalNoteKey), is(newText))),
                "Note was not updated");

    }

    @Test
    public void canHandleAnEmptyPayload() throws Exception {
        webTestHelper.post("/conversations.addNote", "{}")
                .andExpect(status().isBadRequest());

        webTestHelper.post("/conversations.deleteNote", "{}")
                .andExpect(status().isBadRequest());

        webTestHelper.post("/conversations.updateNote", "{}")
                .andExpect(status().isBadRequest());
    }

    @Test
    public void canHandleTextLength() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        StringBuilder generatedString = new StringBuilder();
        while (generatedString.length() < 50001) {
            generatedString.append("a");
        }

        webTestHelper.post("/conversations.addNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"\"}")
                .andExpect(status().isBadRequest());

        webTestHelper.post("/conversations.updateNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\"\"}")
                .andExpect(status().isBadRequest());

        webTestHelper.post("/conversations.addNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\""+ generatedString +"\"}")
                .andExpect(status().isBadRequest());

        webTestHelper.post("/conversations.updateNote",
                        "{\"conversation_id\":\"" + conversationId + "\",\"text\":\""+ generatedString +"\"}")
                .andExpect(status().isBadRequest());
    }
}
