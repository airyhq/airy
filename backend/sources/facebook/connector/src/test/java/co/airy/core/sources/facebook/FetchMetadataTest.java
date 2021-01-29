package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.facebook.api.Api;
import co.airy.core.sources.facebook.api.model.UserProfile;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
class FetchMetadataTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    private static final Topic applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @MockBean
    private Api api;

    @Autowired
    @InjectMocks
    private Connector worker;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationChannels,
                applicationCommunicationMessages,
                applicationCommunicationMetadata
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @BeforeEach
    void beforeEach() throws InterruptedException {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void canFetchMetadata() throws Exception {
        final String sourceConversationId = "source-conversation-id";
        final String channelId = "channel-id";
        final String token = "token";

        final String firstName = "Grace";
        final String lastName = "Grace";
        final String avatarUrl = "http://placehold.it/120x120&text=image1";

        UserProfile userProfile = new UserProfile(firstName, lastName, avatarUrl, "en");
        ArgumentCaptor<String> sourceConversationIdCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        Mockito.when(api.getProfileFromContact(sourceConversationIdCaptor.capture(), tokenCaptor.capture()))
                .thenReturn(userProfile);

        kafkaTestHelper.produceRecords(List.of(
                new ProducerRecord<>(applicationCommunicationChannels.name(), channelId, Channel.newBuilder()
                        .setToken(token)
                        .setSourceChannelId("ps-id")
                        .setSource("facebook")
                        .setName("name")
                        .setId(channelId)
                        .setConnectionState(ChannelConnectionState.CONNECTED)
                        .build()
                ),
                new ProducerRecord<>(applicationCommunicationMessages.name(), "other-message-id",
                        Message.newBuilder()
                                .setId("other-message-id")
                                .setSource("facebook")
                                .setSentAt(Instant.now().toEpochMilli())
                                .setSenderId(sourceConversationId)
                                .setSenderType(SenderType.SOURCE_CONTACT)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId("conversationId")
                                .setChannelId(channelId)
                                .setContent("{\"text\":\"hello world\"}")
                                .build())
        ));

        List<Metadata> metadataList = kafkaTestHelper.consumeValues(4, applicationCommunicationMetadata.name());
        assertThat(metadataList, hasSize(4));

        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.Source.Contact.FIRST_NAME) && metadata.getValue().equals(firstName)
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.Source.Contact.LAST_NAME) && metadata.getValue().equals(lastName)
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.Source.Contact.AVATAR_URL) && metadata.getValue().equals(avatarUrl)
        )));
        assertTrue(metadataList.stream().anyMatch((metadata ->
                metadata.getKey().equals(MetadataKeys.Source.Contact.FETCH_STATE) && metadata.getValue().equals("ok")
        )));

        assertThat(sourceConversationIdCaptor.getValue(), equalTo(sourceConversationId));
        assertThat(tokenCaptor.getValue(), equalTo(token));
    }
}
