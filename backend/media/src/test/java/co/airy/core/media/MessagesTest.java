package co.airy.core.media;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.SenderType;
import co.airy.core.media.services.MediaUpload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.mapping.ContentMapper;
import co.airy.mapping.model.Audio;
import co.airy.spring.core.AirySpringBootApplication;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.hamcrest.core.StringEndsWith;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static co.airy.test.Timing.retryOnException;
import static org.apache.kafka.streams.KafkaStreams.State.RUNNING;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class MessagesTest {
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

    MediaUpload mediaUpload;

    @MockBean
    private AmazonS3 amazonS3;

    @MockBean
    private ContentMapper mapper;

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
    void storesMessageUrlsWithRetries() throws Exception {
        final String originalUrl = "https://picsum.photos/1/1";
        final String urlHash = "64ff04d5ca0ad5951e64e3669c3dbd9159675e177a2ba237bf334495f4778da5";
        final String messageId = UUID.randomUUID().toString();

        final String expectedUrl = String.format("https://%s.s3.amazonaws.com%sdata_%s",
                bucket, path, urlHash);

        final ArgumentCaptor<PutObjectRequest> s3PutCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        when(mapper.renderWithDefaultAndLog(Mockito.any(), Mockito.any())).thenReturn(List.of(new Audio(originalUrl)));

        // Simulate a failure to trigger one retry
        when(amazonS3.putObject(s3PutCaptor.capture()))
                .thenThrow(AmazonServiceException.class)
                .thenReturn(new PutObjectResult());

        kafkaTestHelper.produceRecord(
                new ProducerRecord<>(applicationCommunicationMessages.name(), messageId,
                        Message.newBuilder()
                                .setId(messageId)
                                .setSource("fakesource")
                                .setSentAt(Instant.now().toEpochMilli())
                                .setUpdatedAt(null)
                                .setSenderId("sourceConversationId")
                                .setSenderType(SenderType.SOURCE_CONTACT)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setConversationId("conversationId")
                                .setChannelId("channelId")
                                .setContent("mocked")
                                .build()
                ));

        TimeUnit.SECONDS.sleep(10);

        List<ConsumerRecord<String, Metadata>> metadataRecords = kafkaTestHelper.consumeRecords(2, applicationCommunicationMetadata.name());
        Metadata metadata = metadataRecords.stream()
                .filter((record) -> record.value().getKey().equals(String.format("data_%s", originalUrl)))
                .findFirst().get().value();

        assertThat(metadata.getValue(), equalTo(expectedUrl));

        verify(amazonS3, times(2)).putObject(Mockito.any(PutObjectRequest.class));
        final PutObjectRequest putObjectRequest = s3PutCaptor.getValue();
        assertThat(putObjectRequest.getBucketName(), equalTo(bucket));
        // The filename we wrote to the metadata has to match the file key we write to S3
        assertThat(metadata.getValue(), StringEndsWith.endsWith(putObjectRequest.getKey()));
    }
}
