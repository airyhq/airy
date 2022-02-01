package co.airy.core.contacts;

import co.airy.core.contacts.payload.ContactResponsePayload;
import co.airy.core.contacts.payload.ContactWithMergeHistoryResponsePayload;
import co.airy.core.contacts.payload.CreateContactPayload;
import co.airy.core.contacts.payload.MergeContactsRequestPayload;
import co.airy.core.contacts.util.Topics;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import co.airy.test.RunnableTest;

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
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.Arrays;

import static co.airy.test.Timing.retryOnException;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class MergeContactsTest {
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

    @RequiredArgsConstructor
    private class MergeContacts implements RunnableTest {

        @Getter
        private String mergeContent;

        @NonNull
        private List<ContactResponsePayload> contactsResp;

        public void test() throws Exception {
            mergeContent = webTestHelper.post(
                    "/contacts.merge",
                    objectMapper.writeValueAsString(
                        MergeContactsRequestPayload.builder()
                            .sourceId(UUID.fromString(contactsResp.get(0).getId()))
                            .destinationId(UUID.fromString(contactsResp.get(1).getId()))
                            .build()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        }

    }

    @Test
    void canMergeContacts() throws Exception {
        final List<CreateContactPayload> payload = mockContactsListPayload();

        final String importContent = webTestHelper.post(
                "/contacts.import",
                objectMapper.writeValueAsString(payload))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();

        List<ContactResponsePayload> contactsResp = objectMapper.readValue(importContent,
                new TypeReference<>() {
                });
        assertEquals(contactsResp.size(), 2);

        MergeContacts mergeContacts = new MergeContacts(contactsResp);
        retryOnException(mergeContacts, "Not able to merge contacts");

        final ContactWithMergeHistoryResponsePayload mergedContact = objectMapper.readValue(mergeContacts.getMergeContent(),
                ContactWithMergeHistoryResponsePayload.class);
        final CreateContactPayload sourceContact = payload.get(0);
        final CreateContactPayload destinationContact = payload.get(1);

        assertThat(mergedContact.getDisplayName(), equalTo(destinationContact.getDisplayName()));
        assertThat(mergedContact.getTitle(), equalTo(sourceContact.getTitle()));
        assertNotNull(mergedContact.getMergeHistory());
        assertEquals(mergedContact.getMergeHistory().size(), 1);
        assertThat(mergedContact.getMergeHistory().get(0).getAvatarUrl(), equalTo(sourceContact.getAvatarUrl()));

    }

    private List<CreateContactPayload> mockContactsListPayload() {
        return Arrays.asList(
                CreateContactPayload.builder()
                    .displayName("source contact display name")
                    .avatarUrl("source contact avatar URL")
                    .title("source contact title")
                    .gender("source contact gender")
                    .organizationName("source contact organization name")
                    .build(),
                CreateContactPayload.builder()
                    .displayName("destination contact display name")
                    .avatarUrl("destination contact avatar URL")
                    .build());
    }
}
