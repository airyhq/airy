package co.airy.core.contacts;

import co.airy.core.contacts.dto.Contact;
import co.airy.core.contacts.payload.ContactResponsePayload;
import co.airy.core.contacts.payload.CreateContactPayload;
import co.airy.core.contacts.payload.ListContactsResponsePayload;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import co.airy.test.RunnableTest;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.core.type.TypeReference;
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
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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

    @NoArgsConstructor
    private class ContactsList implements RunnableTest {

        @Getter
        private String listContent;

        public void test() throws Exception {
            listContent = webTestHelper.post("/contacts.list")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(4)))
                .andReturn().getResponse().getContentAsString();
        }

    }

    @Test
    void canImportContacts() throws Exception {
        final List<CreateContactPayload> payload = mockContactsListPayload();

        final String importContent = webTestHelper.post(
                "/contacts.import",
                objectMapper.writeValueAsString(payload))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();

        List<ContactResponsePayload> contactsResp = objectMapper.readValue(
                importContent,
                new TypeReference<List<ContactResponsePayload>>() {});

        ContactsList cl = new ContactsList();
        retryOnException(cl, "Not able to get contacts list");

        final ListContactsResponsePayload contactsList = objectMapper.readValue(cl.getListContent(), ListContactsResponsePayload.class);
        final Map<String, ContactResponsePayload> contactsMap = contactsList.getData().stream()
            .collect(Collectors.toMap(ContactResponsePayload::getId, Function.identity()));

        contactsResp.stream().forEach((contactResponse) -> {
            final ContactResponsePayload c = contactsMap.get(contactResponse.getId());
            assertNotNull(c, String.format("Contact with id %s not found", contactResponse.getId()));

            assertThat(contactResponse.getDisplayName(), equalTo(c.getDisplayName()));
            assertThat(contactResponse.getAvatarUrl(), equalTo(c.getAvatarUrl()));
            assertThat(contactResponse.getTitle(), equalTo(c.getTitle()));
            assertThat(contactResponse.getGender(), equalTo(c.getGender()));
        });
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
