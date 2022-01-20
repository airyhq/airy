package co.airy.core.contacts;

import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import co.airy.core.contacts.dto.Contact;
import co.airy.core.contacts.payload.DeleteContactPayload;
import co.airy.core.contacts.util.TestContact;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.hamcrest.Matchers.hasSize;
import static co.airy.test.Timing.retryOnException;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class DeleteContactTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private TestContact testContact;

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
    void canDeleteContact() throws Exception {
        final String contactId = testContact.createContact(Contact.builder().displayName("A contact").build());

        // Check that the contact is committed to the stream
        retryOnException(() -> {
            webTestHelper.post("/contacts.list")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));
        }, "Contact was not created");
        
        webTestHelper.post(
                "/contacts.delete",
                objectMapper.writeValueAsString(DeleteContactPayload.builder().id(UUID.fromString(contactId)).build()))
            .andExpect(status().isAccepted());

        // Check that the contact was deleted
        retryOnException(() -> {
            webTestHelper.post("/contacts.list")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
        }, "Contact was not deleted");
    }
}
