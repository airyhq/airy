package co.airy.core.sources.viber;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.core.sources.viber.lib.MockAccountInfo;
import co.airy.core.sources.viber.lib.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataRepository;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isMessageMetadata;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;

@Import(MockAccountInfo.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
class EventsRouterTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper testHelper;

    @Autowired
    private AccountInfo accountInfo;

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
    void routesEvents() throws Exception {
        final String conversationStarted = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("events/conversation_started.json"), StandardCharsets.UTF_8);
        final String received = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("events/message_received.json"), StandardCharsets.UTF_8);
        final String delivered = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("events/message_delivered.json"), StandardCharsets.UTF_8);
        final String seen = StreamUtils.copyToString(getClass().getClassLoader().getResourceAsStream("events/message_seen.json"), StandardCharsets.UTF_8);

        testHelper.produceRecords(List.of(
                new ProducerRecord<>(Topics.sourceViberEvents.name(), UUID.randomUUID().toString(), conversationStarted),
                new ProducerRecord<>(Topics.sourceViberEvents.name(), UUID.randomUUID().toString(), received),
                new ProducerRecord<>(Topics.sourceViberEvents.name(), UUID.randomUUID().toString(), delivered),
                new ProducerRecord<>(Topics.sourceViberEvents.name(), UUID.randomUUID().toString(), seen)
        ));

        final List<Message> messages = testHelper.consumeValues(2, Topics.applicationCommunicationMessages.name());
        assertThat(messages, hasSize(2));

        assertThat(messages.stream()
                .filter((message) -> message.getContent().contains("conversation_started")).count(), equalTo(1L));

        final Message userMessage = messages.stream()
                .filter((message) -> message.getContent().contains("I am a user message"))
                .findAny().get();

        assertThat(userMessage.getSenderId(), equalTo("01234567890A="));

        final String messageId = userMessage.getId();

        final List<Metadata> metadataList = testHelper.consumeValues(6, Topics.applicationCommunicationMetadata.name());
        assertThat(metadataList, hasSize(6));

        // 4 contact metadata created
        assertThat(metadataList.stream()
                .filter(MetadataRepository::isConversationMetadata).count(), equalTo(4L));

        // All message metadata points to the same message based on the message token
        final List<Metadata> messageMetadata = metadataList.stream().filter((metadata) ->
                isMessageMetadata(metadata) && getSubject(metadata).getIdentifier().equals(messageId))
                .collect(Collectors.toList());

        assertThat(messageMetadata, hasSize(2));
    }
}
