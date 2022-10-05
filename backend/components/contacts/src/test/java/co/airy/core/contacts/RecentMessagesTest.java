package co.airy.core.contacts;

import co.airy.core.contacts.util.TestContact;
import co.airy.core.contacts.util.TestConversation;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.contact.Contact;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class RecentMessagesTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                Topics.getTopics());
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws Exception {
        MockitoAnnotations.openMocks(this);
        webTestHelper.waitUntilHealthy();
    }

    @Autowired
    private TestContact testContact;

    @Test
    void canListRecentMessages() throws Exception {
        final TestConversation conversation1 = TestConversation.from("messenger", 3);
        final TestConversation conversation2 = TestConversation.from("purchases", 1);
        final UUID conversationId1 = UUID.fromString(conversation1.getConversationId());
        final UUID conversationId2 = UUID.fromString(conversation2.getConversationId());
        kafkaTestHelper.produceRecords(conversation1.getRecords());
        kafkaTestHelper.produceRecords(conversation2.getRecords());

        final String contactId = testContact.createContact(Contact.builder()
                .displayName("Grace Hopper")
                .conversations(Map.of(conversationId1, "messenger",
                        conversationId2, "purchases"))
                .build());

        // TimeUnit.SECONDS.sleep(10000);

        retryOnException(() -> {
            webTestHelper.post("/contacts.recent-messages", "{\"contact_id\":\"" + contactId + "\"}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$['" + conversationId1 + "'].data.length()", equalTo(3)))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].data.length()", equalTo(1)));
        }, "Contact messages were not listed");
    }
}
