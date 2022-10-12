package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.BatchV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1JobSpec;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.util.Yaml;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;

import java.util.List;

import co.airy.log.AiryLoggerFactory;

@Component
@EnableRetry
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
            .metadata(new V1ObjectMeta().name(jobName))
            .spec(new V1JobSpec()
                    .template(new V1PodTemplateSpec()
                        .spec(new V1PodSpec()
                            .addContainersItem(new V1Container()
                                .name(jobName)
                                .image("alpine/helm:latest")
                                .command(cmd))
                            .restartPolicy("Never")
                            .serviceAccountName("airy-controller")))
                    .backoffLimit(4)
                    .ttlSecondsAfterFinished(1));

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

    @Retryable(value = NotCompletedException.class, maxAttemptsExpression = "${retry.maxAttempts}",
               backoff = @Backoff(delayExpression = "${retry.maxDelay}"))
    public void waitForCompletedStatus(
            CoreV1Api api,
            String jobName,
            String namespace) throws NotCompletedException, ApiException {
        final ApiResponse<V1Pod> jobStatus = api.readNamespacedPodStatusWithHttpInfo(
                jobName,
                namespace,
                null);

        if (!jobStatus.getData().getStatus().getPhase().equals("Succeeded")) {
            throw new NotCompletedException();
        }
    }
}
