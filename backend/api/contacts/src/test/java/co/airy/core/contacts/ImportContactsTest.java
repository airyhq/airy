package co.airy.core.contacts;

import co.airy.core.contacts.payload.CreateContactPayload;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.List;
import java.util.Arrays;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ImportContactsTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private Stores stores;

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();

    private static KafkaTestHelper kafkaTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void canImportContacts() throws Exception {
        final List<CreateContactPayload> payload = mockContactsListPayload();

        final String content = webTestHelper.post(
                "/contacts.import",
                objectMapper.writeValueAsString(payload))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
    }

    private List<CreateContactPayload> mockContactsListPayload() {
        return Arrays.asList(
                new CreateContactPayload(
                    "some name 1",
                    "avatar-url-1",
                    "a-title-1",
                    "M",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null),
                new CreateContactPayload(
                    "some name 2",
                    "avatar-url-2",
                    "a-title-2",
                    "F",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null),
                new CreateContactPayload(
                    "some name 3",
                    "avatar-url-3",
                    "a-title-3",
                    "D",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null),
                new CreateContactPayload(
                    "some name 4",
                    "avatar-url-4",
                    "a-title-4",
                    "N",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null));
    }
}
