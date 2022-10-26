package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Job;

import java.util.Map;

import org.slf4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import co.airy.log.AiryLoggerFactory;

@Component
public class InstallerHandlerCacheManager {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandlerCacheManager.class);

    private final HelmJobHandler helmJobHandler;
    private final ApiClient apiClient;
    private final InstalledComponentsHandler installedComponentsHandler;

    InstallerHandlerCacheManager(
            ApiClient apiClient,
            HelmJobHandler helmJobHandler,
            InstalledComponentsHandler installedComponentsHandler) {
        this.apiClient = apiClient;
        this.helmJobHandler = helmJobHandler;
        this.installedComponentsHandler = installedComponentsHandler;
    }

    @Async("threadPoolTaskExecutor")
    public void resetCacheAfterJob(String jobName) {
        try {
            final V1Job job = helmJobHandler.getJobByName(jobName);
            final CoreV1Api api = new CoreV1Api(apiClient);
            helmJobHandler.waitForCompletedStatus(api, job);

            installedComponentsHandler.putInstalledComponentsCache();
            log.info("cache reset");
        } catch(Exception e) {
            log.error("unable to reset cache", e);
        }
    }

    public void changeInstallationStatus(String componentName, String status) throws Exception {
        Map<String, String> cacheStore = installedComponentsHandler.getInstalledComponentsCache();
        cacheStore.put(componentName, status);
        installedComponentsHandler.setInstalledComponentsCache(cacheStore);
    }
}
