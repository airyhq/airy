package co.airy.core.media;

import co.airy.avro.communication.Metadata;
import co.airy.core.media.services.MediaUpload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.core.AirySpringBootApplication;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.apache.kafka.clients.consumer.ConsumerRecord;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;

import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;
import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.isNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class MetadataTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;
    private static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource,
                applicationCommunicationMetadata,
                applicationCommunicationMessages
        );

        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Autowired
    Stores stores;

    @Autowired

    MediaUpload mediaUpload;

    @MockBean
    private AmazonS3 amazonS3;

    @Value("${storage.s3.bucket}")
    private String bucket;

    @Value("${storage.s3.path}")
    private String path;

    @BeforeEach
    void beforeEach() throws Exception {
        MockitoAnnotations.initMocks(this);
        mediaUpload = new MediaUpload(amazonS3, bucket, path);
        retryOnException(() -> assertEquals(stores.getStreamState(), RUNNING), "Failed to reach RUNNING state.");
    }

    @Test
    void storesMetadataUrlsWithRetries() throws Exception {
        final String conversationId = UUID.randomUUID().toString();
        final String originalUrl = "https://picsum.photos/1/1";
        final String metadataId = UUID.randomUUID().toString();
        final String expectedUrl = String.format("https://%s.s3.amazonaws.com%s%s/%s.resolved",
                bucket,
                path,
                conversationId,
                MetadataKeys.Source.Contact.AVATAR_URL);

        final ArgumentCaptor<PutObjectRequest> s3PutCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);

        // Simulate a failure to trigger one retry
        when(amazonS3.putObject(s3PutCaptor.capture()))
                .thenThrow(AmazonServiceException.class)
                .thenReturn(new PutObjectResult());

        kafkaTestHelper.produceRecord(
                new ProducerRecord<>(applicationCommunicationMetadata.name(), metadataId,
                        newConversationMetadata(conversationId,
                                MetadataKeys.Source.Contact.AVATAR_URL,
                                originalUrl)
                ));

        List<ConsumerRecord<String, Metadata>> metadataRecords = kafkaTestHelper.consumeRecords(2, applicationCommunicationMetadata.name());
        Metadata metadata = metadataRecords.stream()
                .filter((record) -> !record.key().equals(metadataId))
                .findFirst().get().value();

        assertThat(metadata.getValue(), equalTo(expectedUrl));

        verify(amazonS3, times(2)).putObject(Mockito.any(PutObjectRequest.class));
        final PutObjectRequest putObjectRequest = s3PutCaptor.getValue();
        assertThat(putObjectRequest.getBucketName(), equalTo(bucket));
        assertThat(putObjectRequest.getKey(),
                equalTo(String.format("%s/%s", conversationId, MetadataKeys.Source.Contact.AVATAR_URL + ".resolved")));
    }
}
