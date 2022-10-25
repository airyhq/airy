package co.airy.core.api.components.configuration;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import co.airy.core.api.components.configuration.model.ComponentConfig;
import co.airy.log.AiryLoggerFactory;
import io.kubernetes.client.openapi.ApiClient;

@Service
public class ConfigurationHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(ConfigurationHandler.class);

    private final ApiClient apiClient;
    private final InstalledComponentsHandler installedComponentsHandler;
    private final String namespace;

    ConfigurationHandler(
            ApiClient apiClient,
            InstalledComponentsHandler installedComponentsHandler,
            @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.installedComponentsHandler = installedComponentsHandler;
        this.namespace = namespace;
    }

    public List<ComponentConfig> listComponentConfigs() throws Exception {
        final Map<String, Boolean> installedComponents = installedComponentsHandler.getInstalledComponents();

        return null;
    }
}
