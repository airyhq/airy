package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Job;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import co.airy.log.AiryLoggerFactory;
import co.airy.core.api.components.installer.model.InstallationStatus;
import co.airy.core.api.components.installer.model.ComponentStatus;

@Component
@EnableScheduling
public class InstallerHandlerCacheManager {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandlerCacheManager.class);

    private final HelmJobHandler helmJobHandler;
    private final ApiClient apiClient;
    private final InstallationStatusComponentsHandler installedComponentsHandler;
    private boolean resetCache = false;

    InstallerHandlerCacheManager(
            ApiClient apiClient,
            HelmJobHandler helmJobHandler,
            InstallationStatusComponentsHandler installedComponentsHandler) {
        this.apiClient = apiClient;
        this.helmJobHandler = helmJobHandler;
        this.installedComponentsHandler = installedComponentsHandler;
    }

    public void resetCacheAfterJob() {
        resetCache = true;
    }

    public void changeInstallationStatus(String componentName, String status) throws Exception {
        Map<String, String> cacheStore = installedComponentsHandler.getInstallationStatusComponentsCache();
        cacheStore.put(componentName, status);
        installedComponentsHandler.setInstallationStatusComponentsCache(cacheStore);
    }

    public boolean isInstalled(String componentName) throws Exception {
        final String installationStatus = installedComponentsHandler
            .getInstallationStatusComponentsCache()
            .getOrDefault(componentName, InstallationStatus.uninstalled);

        return installationStatus.equals(InstallationStatus.installed)
            || installationStatus.equals(InstallationStatus.pending);
    }

    public boolean isUninstalled(String componentName) throws Exception {
        final String installationStatus = installedComponentsHandler
            .getInstallationStatusComponentsCache()
            .getOrDefault(componentName, InstallationStatus.uninstalled);

        return installationStatus.equals(InstallationStatus.uninstalled)
            || installationStatus.equals(InstallationStatus.pending);
    }

    @Scheduled(fixedRateString = "${retry.maxDelay}")
    private void resetCacheWorker() {
        if (!resetCache) {
            return;
        }

        try {
            final CoreV1Api api = new CoreV1Api(apiClient);
            final List<ComponentStatus> componentsStatus = helmJobHandler.getInstallationComponentsStatus(api);

            //FIXME: remove log
            log.info(componentsStatus.toString());
            if (componentsStatus.size() == 0) {
                resetCache = false;
                installedComponentsHandler.putInstallationStatusComponentsCache();
                log.info("cache reset");
                return;
            }

            componentsStatus
                .stream()
                .filter(cs -> cs.getStatus().equals("Succeeded"))
                .forEach(cs -> {
                    try {
                        changeInstallationStatus(
                                cs.getComponentName(),
                                cs.getExpectedInstallationStatus());
                        //FIXME: remove log
                        log.info(String.format("%s -> %s", cs.getComponentName(), cs.getExpectedInstallationStatus()));
                    } catch (Exception e) {
                        log.error(String.format("unable to set expected status for %s, %s", 
                                    cs.getComponentName(),
                                    e));
                    }
                });
        } catch (Exception e) {
            log.error("unable to reset cache", e);
        }
    }
}
