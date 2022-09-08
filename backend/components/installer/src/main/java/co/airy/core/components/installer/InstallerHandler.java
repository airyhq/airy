package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.apis.BatchV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1JobSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.util.Yaml;

import java.util.Map;
import java.util.List;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
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

       launchHelmJob();

       //TODO: handle error properly
    }

    private Map<String, String> getCoreConfig(CoreV1Api api) throws ApiException {
        final ApiResponse<V1ConfigMap> response = api.readNamespacedConfigMapWithHttpInfo(
                "core-config",
                namespace,
                null);

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

    private void launchHelmJob() throws Exception {
        final V1Job job = new V1Job()
            .metadata(new V1ObjectMeta().name("helm-test"))
            .spec(new V1JobSpec()
                    .template(new V1PodTemplateSpec()
                        .spec(new V1PodSpec()
                            .addContainersItem(new V1Container()
                                .name("helm-test")
                                .image("alpine/helm:latest")
                                .command(List.of("helm", "-n", "staging", "list")))
                            .restartPolicy("Never")))
                    .backoffLimit(4));



        //FIXME: remove log
        log.info(Yaml.dump(job));

        final BatchV1Api api = new BatchV1Api(apiClient);
        final ApiResponse<V1Job> response = api.createNamespacedJobWithHttpInfo(
                namespace,
                job,
                null,
                null,
                null,
                null);
    }

}
