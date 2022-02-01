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
import org.springframework.test.web.servlet.ResultActions;

import java.util.Arrays;
import java.util.List;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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
        webTestHelper.waitUntilHealthy();
    }

    @Test
    void canImportContacts() throws Exception {
        final List<CreateContactPayload> payload = mockContactsListPayload();

        webTestHelper.post(
                        "/contacts.import",
                        objectMapper.writeValueAsString(payload))
                .andExpect(status().isCreated());

        retryOnException(() -> {
            final ResultActions actions = webTestHelper.post("/contacts.list")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data", hasSize(4)));

            for (CreateContactPayload contact : payload) {
                actions.andExpect(jsonPath(String.format("$.data[?(@.display_name == \"%s\" && @.avatar_url == \"%s\" && @.title == \"%s\" && @.gender == \"%s\")]",
                        contact.getDisplayName(), contact.getAvatarUrl(), contact.getTitle(), contact.getGender())).exists());
            }
        }, "Unable to find imported contacts");
    }

    private List<CreateContactPayload> mockContactsListPayload() {
        return Arrays.asList(
                CreateContactPayload.builder()
                        .displayName("some name 1")
                        .avatarUrl("avatar-url-1")
                        .title("a-title-1")
                        .gender("M")
                        .build(),
                CreateContactPayload.builder()
                        .displayName("some name 2")
                        .avatarUrl("avatar-url-2")
                        .title("a-title-2")
                        .gender("F")
                        .build(),
                CreateContactPayload.builder()
                        .displayName("some name 3")
                        .avatarUrl("avatar-url-3")
                        .title("a-title-3")
                        .gender("D")
                        .build(),
                CreateContactPayload.builder()
                        .displayName("some name 4")
                        .avatarUrl("avatar-url-4")
                        .title("a-title-4")
                        .gender("N")
                        .build());
    }
}
