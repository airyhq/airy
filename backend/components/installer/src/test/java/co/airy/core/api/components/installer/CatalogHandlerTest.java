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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;

import io.kubernetes.client.openapi.ApiClient;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.doReturn;

import java.io.File;
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

    @MockBean
    private InstallationStatusComponentsHandler installationStatusComponentsHandler;

    @Autowired
    private CatalogHandler catalogHandler;

    @Autowired
    private GitHandler gitHandler;

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
    public void canGetComponents(@TempDir File tempDir) throws Exception {
        callOnApplicationEvent(tempDir);

        doReturn(getInstallationStatues()).when(installationStatusComponentsHandler).getInstallationStatusComponentsCache();

        final List<ComponentDetails> listComponents = catalogHandler.listComponents();

        //NOTE: We are just going to get some of the components in the list, and check his validity
        ComponentDetails enterpriseSalesforceContactsIngestion = listComponents
            .stream()
            .filter((c -> c.getName().equals("enterprise-salesforce-contacts-ingestion")))
            .findAny()
            .orElse(null);
        assertThat(enterpriseSalesforceContactsIngestion, is(notNullValue()));
        assertThat(enterpriseSalesforceContactsIngestion.getInstallationStatus(), equalTo(InstallationStatus.installed));

        ComponentDetails cognigyConnector = listComponents
            .stream()
            .filter((c -> c.getName().equals("cognigy-connector")))
            .findAny()
            .orElse(null);
        assertThat(cognigyConnector, is(notNullValue()));
        assertThat(cognigyConnector.getInstallationStatus(), equalTo(InstallationStatus.uninstalled));
    }

    private void callOnApplicationEvent(File tempDir) throws Exception {
        ReflectionTestUtils.setField(gitHandler, "repoFolder", tempDir);
        gitHandler.onApplicationEvent(event);
    }

    private Map<String, String> getInstallationStatues() {
        return Map.ofEntries(
                Map.entry("sources-whatsapp", "installed"),
                Map.entry("integration-webhook", "installed"),
                Map.entry("sources-chatplugin", "installed"),
                Map.entry("enterprise-dialogflow-connector", "uninstalled"),
                Map.entry("enterprise-zendesk-connector", "installed"),
                Map.entry("mobile", "uninstalled"),
                Map.entry("amazon-s3-connector", "uninstalled"),
                Map.entry("sources-facebook", "installed"),
                Map.entry("sources-twilio", "installed"),
                Map.entry("amelia-connector", "uninstalled"),
                Map.entry("sources-viber", "uninstalled"),
                Map.entry("amazon-lex-v2-connector", "uninstalled"),
                Map.entry("ibm-watson-assistant-connector", "uninstalled"),
                Map.entry("rasa-connector", "installed"),
                Map.entry("sources-google", "installed"),
                Map.entry("cognigy-connector", "uninstalled"),
                Map.entry("enterprise-salesforce-contacts-ingestion", "installed"));
    }


}
