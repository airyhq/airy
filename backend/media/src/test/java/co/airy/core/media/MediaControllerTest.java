package co.airy.core.media;

import co.airy.core.media.services.MediaUpload;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.InputStream;

import static co.airy.test.Timing.retryOnException;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class MediaControllerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource);
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }


    MediaUpload mediaUpload;

    @MockBean
    private AmazonS3 amazonS3;

    @Autowired
    private MockMvc mvc;

    @Value("${s3.bucket}")
    private String bucket;

    @Value("${s3.path}")
    private String path;

    @BeforeEach
    void beforeEach() throws Exception {
        MockitoAnnotations.openMocks(this);
        mediaUpload = new MediaUpload(amazonS3, bucket, path);
    }


    @Test
    void shouldCallS3ToUploadImageDirect() throws Exception {
        final InputStream is = getClass().getResourceAsStream("giphy.gif");

        MockMultipartFile mockMultipartFile = new MockMultipartFile("file", "giphy.gif",
                MediaType.MULTIPART_FORM_DATA_VALUE, is);

        MockMultipartHttpServletRequestBuilder builder =
                (MockMultipartHttpServletRequestBuilder) MockMvcRequestBuilders.multipart("/media.upload")
                        .file(mockMultipartFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA_VALUE);

        retryOnException(
                () -> {
                    mvc.perform(builder).andExpect(status().isOk());
                    Mockito.verify(amazonS3, Mockito.times(1)).putObject(Mockito.any(PutObjectRequest.class));
                },
                "Something went wrong while uploading an image"
        );
    }
}
