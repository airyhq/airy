package co.airy.core.api.components.installer;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.util.StreamUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import io.kubernetes.client.openapi.models.V1ConfigMap;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;

import java.nio.charset.StandardCharsets;
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
public class InstallerHandlerTest {
    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    private static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();


    @MockBean
    private ApiClient apiClient;

    @MockBean
    private HelmJobHandler helmJobHandler;

    @MockBean
    private CatalogHandler catalogHandler;

    @MockBean
    private InstallerHandlerCacheManager installerHandlerCacheManager;

    @Autowired
    private InstallerHandler installerHandler;

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
    public void canInstallComponent() throws Exception {
        final ComponentDetails sourcesChatplugin = new ComponentDetails()
            .add("name", "sources-chatplugin")
            .add("repository", "airy-core")
            .add("installed", false);

        doReturn(sourcesChatplugin).when(catalogHandler).getComponentByName("sources-chatplugin");
        doReturn(false).when(installerHandlerCacheManager).isInstalled("sources-chatplugin");
        doNothing().when(installerHandlerCacheManager).changeInstallationStatus("sources-chatplugin", InstallationStatus.pending);
        doNothing().when(installerHandlerCacheManager).resetCacheAfterJob();

        final MockedConstruction.MockInitializer<CoreV1Api> fn = (mock, context) -> {
            final ApiResponse<V1ConfigMap> coreConfigResponse = new ApiResponse<>(
                    200,
                    null,
                    new V1ConfigMap().data(getCoreConfig()));

            doReturn(coreConfigResponse).when(mock).readNamespacedConfigMapWithHttpInfo(
                    "core-config",
                    "test-namespace",
                    null);

            doReturn(null).when(helmJobHandler).launchHelmJob(
                    eq("helm-install-sources-chatplugin"),
                    cmd.capture(),
                    labels.capture());

            final ApiResponse<V1ConfigMap> repositoriesResponse = new ApiResponse<>(
                    200,
                    null,
                    new V1ConfigMap().data(getRepositoriesConfig()));

            doReturn(repositoriesResponse).when(mock).readNamespacedConfigMapWithHttpInfo(
                    "repositories",
                    "test-namespace",
                    null);
        };

        try (MockedConstruction<CoreV1Api> apiMock = Mockito.mockConstruction(CoreV1Api.class, fn)) {
            installerHandler.installComponent("sources-chatplugin");

            assertThat(cmd.getValue().size(), equalTo(3));
            assertThat(cmd.getValue().get(2), equalTo(getHelmInstallCmd())); 
            assertThat(labels.getValue().get("helm"), equalTo("install"));
            assertThat(labels.getValue().get("component"), equalTo("sources-chatplugin"));
        }
    }

    @Test
    public void canUninstallComponent() throws Exception {
        doReturn(null).when(helmJobHandler).launchHelmJob(
                eq("helm-uninstall-enterprise-dialogflow-connector"),
                cmd.capture(),
                labels.capture());

        doReturn(false).when(installerHandlerCacheManager).isUninstalled("enterprise-dialogflow-connector");
        doNothing().when(installerHandlerCacheManager).changeInstallationStatus("enterprise-dialogflow-connector", InstallationStatus.pending);
        doNothing().when(installerHandlerCacheManager).resetCacheAfterJob();

        installerHandler.uninstallComponent("enterprise-dialogflow-connector");

        assertThat(cmd.getValue().size(), equalTo(3));
        assertThat(cmd.getValue().get(2), equalTo("helm -n test-namespace uninstall enterprise-dialogflow-connector")); 
        assertThat(labels.getValue().get("helm"), equalTo("uninstall"));
        assertThat(labels.getValue().get("component"), equalTo("enterprise-dialogflow-connector"));
    }

    private Map<String, String> getCoreConfig() {
        return Map.of(
                "global.yaml", getGlobals(),
                "APP_IMAGE_TAG", "0.50.0-alpha");
    }

    private String getGlobals() {
        final List<String> globals = List.of(
            "global:",
            "  containerRegistry: ghcr.io/airyhq",
            "  busyboxImage: ghcr.io/airyhq/infrastructure/busybox:latest",
            "  host: test.airy.co",
            "  apiHost: https://test.airy.co",
            "  ingress:",
            "    letsencrypt: false");

        return String.join("\n", globals);
    }

    private Map<String, String> getRepositoriesConfig() throws Exception {
        final String repositoriesBlob = StreamUtils.copyToString(
                getClass().getClassLoader().getResourceAsStream("repositories.json"),
                StandardCharsets.UTF_8);

        return Map.of("repositories.json", repositoriesBlob);
    }

    private String getHelmInstallCmd() throws Exception {
        final String helmInstallCmd = StreamUtils.copyToString(
                getClass().getClassLoader().getResourceAsStream("helm-install-cmd.txt"),
                StandardCharsets.UTF_8);

        return helmInstallCmd.substring(0, helmInstallCmd.length() - 1);
    }
}
