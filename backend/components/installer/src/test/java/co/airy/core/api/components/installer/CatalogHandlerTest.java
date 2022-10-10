package co.airy.core.api.components.installer;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;

import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.Mockito;

import static org.mockito.Mockito.doReturn;

import java.io.File;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class CatalogHandlerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    @Mock
    private ApplicationReadyEvent event;

    @MockBean
    private ApiClient apiClient;

    @MockBean
    private HelmJobHandler helmJobHandler;

    @Autowired
    private CatalogHandler catalogHandler;

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(
                sharedKafkaTestResource,
                applicationCommunicationMetadata);
        kafkaTestHelper.beforeAll();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }


    @Test
    public void canOnApplicationEvent(@TempDir File tempDir) throws Exception {
        callOnApplicationEvent(tempDir);
    }

    @Test
    void canGetComponents(@TempDir File tempDir) throws Exception {
        callOnApplicationEvent(tempDir);

        final V1Job job = new V1Job()
            .metadata(new V1ObjectMeta().name("helm-installed").namespace("test-namespace"));
    }

    private void callOnApplicationEvent(File tempDir) throws Exception {
        ReflectionTestUtils.setField(catalogHandler, "repoFolder", tempDir);
        catalogHandler.onApplicationEvent(event);
    }

}
