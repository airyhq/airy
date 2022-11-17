package co.airy.core.api.components.installer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Job;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import co.airy.log.AiryLoggerFactory;
import co.airy.core.api.components.installer.model.InstallationStatus;

@Component
public class InstallationStatusComponentsHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandler.class);
    public static final String KEY = "cache-key";

    private final ApiClient apiClient;
    private final String namespace;
    private final HelmJobHandler helmJobHandler;
    private final Stores stores;
    private final GitHandler gitHandler;

    InstallationStatusComponentsHandler(
            ApiClient apiClient,
            HelmJobHandler helmJobHandler,
            Stores stores,
            GitHandler gitHandler,
            @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.namespace = namespace;
        this.helmJobHandler = helmJobHandler;
        this.stores = stores;
        this.gitHandler = gitHandler;
    }


    @Cacheable(key = "#root.target.KEY", value = "installedComponents")
    public Map<String, String> getInstallationStatusComponentsCache() throws Exception {
        final Map<String, String> installedComponents = getInstallationStatusComponents();

        stores.storeFromCacheMap(installedComponents);
        return installedComponents;
    }

    @CachePut(key = "#root.target.KEY", value = "installedComponents")
    public Map<String, String> putInstallationStatusComponentsCache() throws Exception {
        final Map<String, String> installedComponents = getInstallationStatusComponents();

        stores.storeFromCacheMap(installedComponents);
        return installedComponents;
    }

    @CachePut(key = "#root.target.KEY", value = "installedComponents")
    public Map<String, String> setInstallationStatusComponentsCache(Map<String, String> cache) throws Exception {
        stores.storeFromCacheMap(cache);
        return cache;
    }

    private Map<String, String> getInstallationStatusComponents() throws Exception {

        ArrayList<String> cmd = new ArrayList<>();
        cmd.add("sh");
        cmd.add("-c");
        cmd.add(String.format(
                    "helm -n %s list | awk '{print $1}' | tail -n +2",
                    namespace));

        final V1Job job = helmJobHandler.launchHelmJob("helm-installed", cmd, Map.of("helm", "installed"));
        final CoreV1Api api = new CoreV1Api(apiClient);

        final String podName = helmJobHandler.waitForCompletedStatus(api, job);

        final ApiResponse<String> response = api.readNamespacedPodLogWithHttpInfo(
                podName,
                job.getMetadata().getNamespace(),
                "",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null);

        final Map<String, String> installedComponents = Arrays.asList(response.getData().split("\\n"))
                    .stream()
                    .collect(Collectors.toMap(e -> e, e -> InstallationStatus.installed));

        if (installedComponents == null) {
            throw new JobEmptyException();
        }

        return gitHandler.listAvailableCompnents()
            .stream()
            .map(name -> Map.entry(name, installedComponents.getOrDefault(name, InstallationStatus.uninstalled)))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
