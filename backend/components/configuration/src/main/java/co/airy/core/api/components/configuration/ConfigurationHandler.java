package co.airy.core.api.components.configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import co.airy.core.api.components.configuration.model.ComponentConfig;
import co.airy.log.AiryLoggerFactory;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMapList;

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
        final CoreV1Api api = new CoreV1Api(apiClient);
        final ApiResponse<V1ConfigMapList> response = api.listNamespacedConfigMapWithHttpInfo(
                namespace,
                null,
                null,
                null,
                null,
                "core.airy.co/component",
                null,
                null,
                null,
                null,
                null);

        return response
            .getData()
            .getItems()
            .stream()
            .filter(c -> installedComponents.getOrDefault(c.getMetadata().getName(), false))
            .map(c -> ComponentConfig.builder()
                        .name(c.getMetadata().getName())
                        .data(Optional.ofNullable(c.getData()).orElse(new HashMap<>()))
                        .build())
            .collect(Collectors.toList());
    }
}
