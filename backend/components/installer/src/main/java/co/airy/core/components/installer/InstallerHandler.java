package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import co.airy.log.AiryLoggerFactory;

@Service
public class InstallerHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandler.class);

    private final ApiClient apiClient;
    private final String namespace;

    InstallerHandler(ApiClient apiClient, @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.namespace = namespace;
    }

    //TODO: Add return value and correct exception handleling
    public void installComponent(String componentName) throws Exception {
       final CoreV1Api api = new CoreV1Api(apiClient);
       final Map<String, String> coreConfig = getCoreConfig(api);
       final String globals = coreConfig.get("global.yaml");
       final String version = coreConfig.get("APP_IMAGE_TAG");

       //TODO: handle error properly
    }

    private Map<String, String> getCoreConfig(CoreV1Api api) throws ApiException {
        final ApiResponse<V1ConfigMap> response = api.readNamespacedConfigMapWithHttpInfo(
                "core-config",
                namespace,
                "false");

        //TODO: handle http error
        final V1ConfigMap config = response.getData();
        final Map<String, String> data = config.getData();
        if (data == null) {
            log.error("core-config configuration not found");
            //TODO: do better error handleling
            throw new ApiException();
        }

        return data;
    }


}
