package co.airy.core.contacts;

import co.airy.core.contacts.dto.Contact;
import co.airy.core.contacts.util.TestContact;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
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

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class ListContactsTest {
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
    void canListContacts() throws Exception {
        final String contactId1 = testContact.createContact(Contact.builder().displayName("Grace Hopper").build());
        final String contactId2 = testContact.createContact(Contact.builder().displayName("Barbara Liskov").build());

        retryOnException(() -> {
            webTestHelper.post("/contacts.list")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data[*].id", containsInAnyOrder(contactId1, contactId2)));
        }, "Contacts were not listed");
    }

    @Test
    void canGetContact() throws Exception {
        final UUID conversationId = UUID.randomUUID();
        final String contactId = testContact.createContact(Contact.builder()
                .displayName("Ada Lovelace")
                .conversations(Map.of(conversationId, "source"))
                .build());

        retryOnException(() -> {
            webTestHelper.post("/contacts.info", "{\"id\":\"" + contactId + "\"}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", equalTo(contactId)))
                    .andExpect(jsonPath("$.display_name", equalTo("Ada Lovelace")));
        }, "Contact was not found using contact id");

        retryOnException(() -> {
            webTestHelper.post("/contacts.info", "{\"conversation_id\":\"" + conversationId + "\"}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", equalTo(contactId)))
                    .andExpect(jsonPath("$.display_name", equalTo("Ada Lovelace")));
        }, "Contact was not found using conversation id");
    }
}
