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
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

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

    public V1Job launchHelmJob(String jobName, List<String> cmd, String label) throws Exception {
        final V1Job runningJob = isJobAlreadyRunning(jobName);
        if (runningJob != null) {
            return runningJob;
        }

        final V1Job job = new V1Job()
            .metadata(new V1ObjectMeta().name(jobName))
            .spec(new V1JobSpec()
                    .template(new V1PodTemplateSpec()
                        .metadata(new V1ObjectMeta().labels(Map.of("helm", label)))
                        .spec(new V1PodSpec()
                            .addContainersItem(new V1Container()
                                .name(jobName)
                                .image("alpine/helm:latest")
                                .command(cmd))
                            .restartPolicy("Never")
                            .serviceAccountName("airy-controller")))
                    .backoffLimit(0)
                    .ttlSecondsAfterFinished(10));

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

    @Retryable(value = JobEmptyException.class, maxAttemptsExpression = "${retry.maxAttempts}",
               backoff = @Backoff(delayExpression = "${retry.maxDelay}"))
    public V1Job getJobByName(String jobName) throws JobEmptyException {
        final V1Job job = isJobAlreadyRunning(jobName);
        if (job == null) {
            throw new JobEmptyException();
        }

        return job;
    }

    @Retryable(value = NotCompletedException.class, maxAttemptsExpression = "${retry.maxAttempts}",
               backoff = @Backoff(delayExpression = "${retry.maxDelay}"))
    public String waitForCompletedStatus(CoreV1Api api, V1Job job) throws NotCompletedException, ApiException {
        final ApiResponse<V1PodList> listResponse = api.listNamespacedPodWithHttpInfo(
                job.getMetadata().getNamespace(),
                null,
                null,
                null,
                null,
                "job-name",
                null,
                null,
                null,
                null,
                null);
        final String podName = listResponse
                .getData()
                .getItems()
                .stream()
                .map(V1Pod::getMetadata)
                .filter(m -> m.getLabels().get("job-name").equals(job.getMetadata().getName()))
                .map(V1ObjectMeta::getName)
                .findAny()
                .orElse("");

        if (podName.isEmpty()) {
            throw new NotCompletedException();
        }

        final ApiResponse<V1Pod> podStatus = api.readNamespacedPodStatusWithHttpInfo(
                podName,
                namespace,
                null);

        if (!podStatus.getData().getStatus().getPhase().equals("Succeeded")) {
            throw new NotCompletedException();
        }

        return podName;
    }

    private V1Job isJobAlreadyRunning(String jobName) {
        try {
            final BatchV1Api api = new BatchV1Api(apiClient);
            final ApiResponse<V1Job> response = api.readNamespacedJobWithHttpInfo(
                    jobName,
                    namespace,
                    null);
            return response.getData();
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return null;
            }
        }

        return null;
    }
}
