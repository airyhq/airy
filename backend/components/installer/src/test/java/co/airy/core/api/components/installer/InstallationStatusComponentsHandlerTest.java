package co.airy.core.api.components.installer;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;

import co.airy.core.api.components.installer.model.ComponentDetails;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.doReturn;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import co.airy.core.api.components.installer.model.InstallationStatus;

@ContextConfiguration(loader = AnnotationConfigContextLoader.class)
@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
public class InstallationStatusComponentsHandlerTest {

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
    private GitHandler gitHandler;

    @Autowired
    private InstallationStatusComponentsHandler installationStatusComponentsHandler;

    @Captor
    private ArgumentCaptor<ArrayList<String>> cmd;

    @Captor
    private ArgumentCaptor<Map<String, String>> labels;

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
    public void canGetInstallationStatusComponentsCache(@TempDir File tempDir) throws Exception {
        callOnApplicationEvent(tempDir);

        final V1Job job = new V1Job()
            .metadata(new V1ObjectMeta().name("helm-installed").namespace("test-namespace"));

        doReturn(job).when(helmJobHandler).launchHelmJob(
                eq(job.getMetadata().getName()),
                cmd.capture(),
                labels.capture());
        doReturn("helm-installed-test").when(helmJobHandler).waitForCompletedStatus(isA(CoreV1Api.class), eq(job));

        final MockedConstruction.MockInitializer<CoreV1Api> fn = (mock, context) -> {
            final ApiResponse<String> response = new ApiResponse<>(
                    200,
                    null,
                    getInstalledComponents());

            doReturn(response).when(mock).readNamespacedPodLogWithHttpInfo(
                "helm-installed-test",
                job.getMetadata().getNamespace(),
                "",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);
        };

        try (MockedConstruction<CoreV1Api> apiMock = Mockito.mockConstruction(CoreV1Api.class, fn)) {
            final Map<String, String> installationStatues = installationStatusComponentsHandler.getInstallationStatusComponentsCache();

            assertThat(cmd.getValue().size(), equalTo(3));
            assertThat(cmd.getValue().get(2), equalTo("helm -n test-namespace list | awk '{print $1}' | tail -n +2")); 
            assertThat(labels.getValue().get("helm"), equalTo("installed"));

            assertThat(installationStatues.get("sources-facebook"), equalTo("installed"));
            assertThat(installationStatues.get("enterprise-salesforce-contacts-ingestion"), equalTo("installed"));
            assertThat(installationStatues.get("amazon-s3-connector"), equalTo("uninstalled"));
            assertThat(installationStatues.get("mobile"), equalTo("uninstalled"));
        }
    }

    private void callOnApplicationEvent(File tempDir) throws Exception {
        ReflectionTestUtils.setField(gitHandler, "repoFolder", tempDir);
        gitHandler.onApplicationEvent(event);
    }

    private String getInstalledComponents() {
        final List<String> installedComponents = List.of(
            "api-contacts",
            "enterprise-salesforce-contacts-ingestion",
            "enterprise-zendesk-connector",
            "integration-webhook",
            "rasa-connector",
            "sources-chatplugin",
            "sources-facebook",
            "sources-google",
            "sources-twilio",
            "sources-whatsapp");

        return String.join("\n", installedComponents);
    }
}
