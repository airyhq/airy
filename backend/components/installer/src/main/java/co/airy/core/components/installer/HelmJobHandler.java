package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.BatchV1Api;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1JobSpec;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.util.Yaml;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

import co.airy.log.AiryLoggerFactory;

@Component
public class HelmJobHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(HelmJobHandler.class);

    private final ApiClient apiClient;
    private final String namespace;

    HelmJobHandler(ApiClient apiClient, @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.namespace = namespace;
    }

    public V1Job launchHelmJob(String jobName, List<String> cmd) throws Exception {
        final V1Job job = new V1Job()
            .metadata(new V1ObjectMeta().name("helm-test"))
            .spec(new V1JobSpec()
                    .template(new V1PodTemplateSpec()
                        .spec(new V1PodSpec()
                            .addContainersItem(new V1Container()
                                .name("helm-test")
                                .image("alpine/helm:latest")
                                .command(cmd))
                            .restartPolicy("Never")
                            .serviceAccountName("airy-controller")))
                    .backoffLimit(4)
                    //FIXME: To change to 0
                    .ttlSecondsAfterFinished(30));



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

        return response.getData();
    }
}
