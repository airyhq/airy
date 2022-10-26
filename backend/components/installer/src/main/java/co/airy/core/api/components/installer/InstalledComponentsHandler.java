package co.airy.core.api.components.installer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Job;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.stereotype.Component;

import co.airy.log.AiryLoggerFactory;
import co.airy.core.api.components.installer.model.InstallationStatus;

@Component
public class InstalledComponentsHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandler.class);
    public static final String KEY = "cache-key";

    private final ApiClient apiClient;
    private final String namespace;
    private final HelmJobHandler helmJobHandler;
    private final ConcurrentMapCacheManager cache;

    InstalledComponentsHandler(
            ApiClient apiClient,
            HelmJobHandler helmJobHandler,
            ConcurrentMapCacheManager cache,
            @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.namespace = namespace;
        this.helmJobHandler = helmJobHandler;
        this.cache = cache;
    }


    @Cacheable(key = "#root.target.KEY", value = "installedComponents")
    public Map<String, String> getInstalledComponentsCache() throws Exception {
        return getInstalledComponents();
    }

    @CachePut(key = "#root.target.KEY", value = "installedComponents")
    public Map<String, String> putInstalledComponentsCache() throws Exception {
        return getInstalledComponents();
    }

    @CachePut(key = "#root.target.KEY", value = "installedComponents")
    public Map<String, String> setInstalledComponentsCache(Map<String, String> cache) throws Exception {
        return cache;
    }

    private Map<String, String> getInstalledComponents() throws Exception {

        ArrayList<String> cmd = new ArrayList<>();
        cmd.add("sh");
        cmd.add("-c");
        cmd.add(String.format(
                    "helm -n %s list | awk '{print $1}' | tail -n +2",
                    namespace));

        final V1Job job = helmJobHandler.launchHelmJob("helm-installed", cmd);
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

        final Map<String, String> installedComponents = Stream.concat(
                getStoredInCache().entrySet().stream(),
                Arrays.asList(response.getData().split("\\n"))
                    .stream()
                    .collect(Collectors.toMap(e -> e, e -> InstallationStatus.installed))
                    .entrySet()
                    .stream())
            .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (v1, v2) -> v2));

        if (installedComponents == null) {
            throw new JobEmptyException();
        }

        return installedComponents;
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> getStoredInCache() {
        final Map<String, String> storedInCache = cache
            .getCache("installedComponents")
            .get(KEY, HashMap.class);

        return Optional.ofNullable(storedInCache).orElse(new HashMap<>());
    }
}
