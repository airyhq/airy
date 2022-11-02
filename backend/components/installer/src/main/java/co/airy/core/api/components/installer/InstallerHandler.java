package co.airy.core.api.components.installer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import co.airy.core.api.components.installer.model.Component;
import co.airy.core.api.components.installer.model.ComponentDetails;
import co.airy.core.api.components.installer.model.InstallationStatus;
import co.airy.core.api.components.installer.model.Repository;
import co.airy.log.AiryLoggerFactory;

@Service
public class InstallerHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandler.class);

    private final ApiClient apiClient;
    private final HelmJobHandler helmJobHandler;
    private final CatalogHandler catalogHandler;
    private final InstallerHandlerCacheManager installerHandlerCacheManager;
    private final String namespace;
    private final ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    InstallerHandler(
            ApiClient apiClient,
            HelmJobHandler helmJobHandler,
            CatalogHandler catalogHandler,
            InstallerHandlerCacheManager installerHandlerCacheManager,
            @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.helmJobHandler = helmJobHandler;
        this.catalogHandler = catalogHandler;
        this.installerHandlerCacheManager = installerHandlerCacheManager;
        this.namespace = namespace;
    }

    public void installComponent(String componentName) throws Exception {
        if (installerHandlerCacheManager.isInstalled(componentName)) {
            log.info(String.format("component %s is already or in the process of installation", componentName));
            return;
        }

        final CoreV1Api api = new CoreV1Api(apiClient);
        final Map<String, String> coreConfig = getConfigMap(api, "core-config");
        final String globals = coreConfig.get("global.yaml");
        final String version = coreConfig.get("APP_IMAGE_TAG");
        final Map<String, Repository> repositories = getRepositories(api);
        final Component component = getComponentFromName(repositories, componentName, version);
        final List<String> cmd = getInstallCommand(component, globals);


        final String jobName = String.format("helm-install-%s", componentName);
        helmJobHandler.launchHelmJob(jobName, cmd, "install");
        installerHandlerCacheManager.changeInstallationStatus(componentName, InstallationStatus.pending);
        installerHandlerCacheManager.resetCacheAfterJob(jobName);
    }

    public void uninstallComponent(String componentName) throws Exception {
        if (installerHandlerCacheManager.isUninstalled(componentName)) {
            log.info(String.format("component %s is already or in the process of uninstallation", componentName));
            return;
        }

        final List<String> cmd = getUninstallCommand(componentName);

        final String jobName = String.format("helm-uninstall-%s", componentName);
        helmJobHandler.launchHelmJob(jobName, cmd, "uninstall");
        installerHandlerCacheManager.changeInstallationStatus(componentName, InstallationStatus.pending);
        installerHandlerCacheManager.resetCacheAfterJob(jobName);
    }

    private Component getComponentFromName(
            Map<String, Repository> repositories,
            String componentName,
            String version) throws Exception {

        ComponentDetails componentDetails = catalogHandler.getComponentByName(componentName);

        final Repository repo = repositories.get(componentDetails.getRepository());
        if (repo == null) {
            log.error("repository %s not found", componentDetails.getRepository());
            throw new NoSuchElementException();
        }

        return Component.builder()
            .name(componentDetails.getName())
            .url(String.format("%s/charts/%s-%s.tgz", repo.getUrl(), componentDetails.getName(), version))
            .username(repo.getUsername())
            .password(repo.getPassword())
            .build();
    }

    private Map<String, Repository> getRepositories(CoreV1Api api) throws ApiException, JsonProcessingException {
        final String repositoriesBlob = getConfigMap(api, "repositories").get("repositories.json");
        if (repositoriesBlob == null || repositoriesBlob.isEmpty()) {
            log.error("repositories json configuration not found");
            throw new ApiException();
        }

        final List<Repository> repos = mapper.readValue(
                repositoriesBlob,
                new TypeReference<Map<String, List<Repository>>>(){}).get("repositories");
        return repos.stream().collect(Collectors.toMap(Repository::getName, Function.identity()));
    }

    private Map<String, String> getConfigMap(CoreV1Api api, String configName) throws ApiException {
        final ApiResponse<V1ConfigMap> response = api.readNamespacedConfigMapWithHttpInfo(
                configName,
                namespace,
                null);

        final V1ConfigMap config = response.getData();
        final Map<String, String> data = config.getData();
        if (data == null) {
            log.error("core-config configuration not found");
            throw new ApiException();
        }

        return data;
    }

    private List<String> getInstallCommand(Component component, String globals) {

        ArrayList<String> cmd = new ArrayList<>();
        cmd.add("sh");
        cmd.add("-c");
        cmd.add(String.format(
                    "helm -n %s install %s %s %s %s --values <(echo %s | base64 -d)",
                    namespace,
                    component.getName(),
                    component.getUrl(),
                    Optional.ofNullable(component.getUsername()).map(u -> String.format("--username %s", u)).orElse(""),
                    Optional.ofNullable(component.getPassword()).map(p -> String.format("--password %s", p)).orElse(""),
                    Base64.getEncoder().encodeToString(globals.getBytes())));

        return cmd;
    }

    private List<String> getUninstallCommand(String componentName) {
        ArrayList<String> cmd = new ArrayList<>();
        cmd.add("sh");
        cmd.add("-c");
        cmd.add(String.format(
                    "helm -n %s uninstall %s",
                    namespace,
                    componentName));

        return cmd;
    }
}
