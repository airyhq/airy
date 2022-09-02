package co.airy.core.contacts;

import co.airy.model.contacts.Contact;
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
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
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
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
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
    void canUpdateContact() throws Exception {
        final UUID conversationId = UUID.randomUUID();
        final String contactId = testContact.createContact(Contact.builder()
                .displayName("Ada Lovelace")
                .address(
                        Contact.Address.builder()
                                .addressLine1("123 Fake St")
                                .city("SF")
                                .build())
                .conversations(Map.of(conversationId, "source"))
                .build());

        // Add two fields and delete a nested field
        final String payload = "{\"id\":\"" + contactId + "\"," +
                "\"address\":{\"address_line1\":\"123 Real St\",\"city\":\"\"},\"timezone\":-3}";
        retryOnException(() -> {
            webTestHelper.post("/contacts.update", payload)
                    .andExpect(status().isAccepted());
        }, "Could not update contact using contact id");

        retryOnException(() -> {
            webTestHelper.post("/contacts.info", "{\"id\":\"" + contactId + "\"}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", equalTo(contactId)))
                    .andExpect(jsonPath("$.address.address_line1", equalTo("123 Real St")))
                    .andExpect(jsonPath("$.address.city", is(nullValue())));
        }, "Could not confirm that the contact was updated");
    }
}
