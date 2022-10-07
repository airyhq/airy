package co.airy.core.contacts;

import co.airy.core.contacts.util.TestContact;
import co.airy.core.contacts.util.TestConversation;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.contact.Contact;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
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
import static org.hamcrest.core.IsNull.nullValue;
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
    void canListAndPaginateRecentMessages() throws Exception {
        final TestConversation conversation1 = TestConversation.from("messenger", 2);
        final TestConversation conversation2 = TestConversation.from("purchases", 1);
        final TestConversation conversation3 = TestConversation.from("exclude_this_source", 1);
        final UUID conversationId1 = UUID.fromString(conversation1.getConversationId());
        final UUID conversationId2 = UUID.fromString(conversation2.getConversationId());
        final UUID conversationId3 = UUID.fromString(conversation3.getConversationId());
        kafkaTestHelper.produceRecords(conversation1.getRecords());
        kafkaTestHelper.produceRecords(conversation2.getRecords());
        kafkaTestHelper.produceRecords(conversation3.getRecords());

        final String contactId = testContact.createContact(Contact.builder()
                .displayName("Grace Hopper")
                .conversations(Map.of(conversationId1, "messenger",
                        conversationId2, "purchases",
                        conversationId3, "exclude_this_source"))
                .build());

        retryOnException(() -> {
            final String response = webTestHelper.post("/contacts.recent-messages",
                            "{\"contact_id\":\"" + contactId + "\",\"page_size\":1," +
                                    "\"include_sources\":[\"messenger\",\"purchases\"]}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$['" + conversationId1 + "'].data.length()", equalTo(1)))
                    .andExpect(jsonPath("$['" + conversationId1 + "'].pagination_data.next_cursor").isNotEmpty())
                    .andExpect(jsonPath("$['" + conversationId1 + "'].pagination_data.total", equalTo(2)))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].data.length()", equalTo(1)))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].pagination_data.next_cursor").value(nullValue()))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].pagination_data.total", equalTo(1)))
                    .andExpect(jsonPath("$['" + conversationId3 + "']").doesNotExist())
                    .andReturn()
                    .getResponse().getContentAsString();

            final String cursor = JsonPath.parse(response).read("$['" + conversationId1 + "'].pagination_data.next_cursor");

            // paginate on the first conversation
            webTestHelper.post("/contacts.recent-messages",
                            "{\"contact_id\":\"" + contactId + "\",\"page_size\":1," +
                                    "\"cursors\":{\"" + conversationId1 + "\":\"" + cursor + "\"}}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$['" + conversationId1 + "'].data.length()", equalTo(1)))
                    .andExpect(jsonPath("$['" + conversationId1 + "'].pagination_data.next_cursor").value(nullValue()))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].data.length()", equalTo(1)))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].pagination_data.next_cursor").value(nullValue()))
                    .andExpect(jsonPath("$['" + conversationId2 + "'].pagination_data.total", equalTo(1)))
                    .andExpect(jsonPath("$['" + conversationId3 + "']").exists());

        }, "Contact messages were not listed");
    }
}
