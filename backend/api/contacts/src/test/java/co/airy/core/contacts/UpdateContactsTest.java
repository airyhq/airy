package co.airy.core.contacts;

import co.airy.core.contacts.dto.Contact;
import co.airy.core.contacts.util.TestContact;
import co.airy.kafka.schema.application.ApplicationCommunicationContacts;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class UpdateContactsTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                new ApplicationCommunicationContacts(),
                new ApplicationCommunicationMetadata(),
                new ApplicationCommunicationMessages());
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.openMocks(this);
    }

    @Autowired
    private TestContact testContact;

    @Test
    void canUpdate() throws Exception {
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
    }
}