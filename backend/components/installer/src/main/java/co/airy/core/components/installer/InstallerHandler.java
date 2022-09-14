package co.airy.core.api.components.installer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.BatchV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1JobSpec;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.util.Yaml;

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

import co.airy.core.api.components.installer.model.Repository;
import co.airy.core.api.components.installer.model.Component;
import co.airy.log.AiryLoggerFactory;

@Service
public class InstallerHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(InstallerHandler.class);

    private final ApiClient apiClient;
    private final String namespace;
    private final ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    InstallerHandler(ApiClient apiClient, @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.namespace = namespace;
    }

    //TODO: Add return value and correct exception handleling
    public void installComponent(String componentName) throws Exception {
       final CoreV1Api api = new CoreV1Api(apiClient);
       final Map<String, String> coreConfig = getConfigMap(api, "core-config");
       final String globals = coreConfig.get("global.yaml");
       final String version = coreConfig.get("APP_IMAGE_TAG");
       final Map<String, Repository> repositories = getRepositories(api);
       final Component component = getComponentFromName(repositories, componentName, version);
       final List<String> cmd = getInstallCommand(component, globals);


       launchHelmJob(componentName, cmd);

       //TODO: handle error properly
       log.info(globals);
       log.info(version);
    }

    //TODO: Add return value and correct exception handleling
    public void uninstallComponent(String componentName) throws Exception {
       //FIXME: to be removed when we remove the notion of repos and we get the repository name from github config
       String[] names = componentName.split("/");
       final List<String> cmd = getUninstallCommand(name[1]);


       launchHelmJob(componentName, cmd);
    }

    private Component getComponentFromName(
            Map<String, Repository> repositories,
            String componentName,
            String version) throws NoSuchElementException {
       //FIXME: to be removed when we remove the notion of repos and we get the repository name from github config
       String[] names = componentName.split("/");

       final Repository repo = repositories.get(names[0]);
       if (repo == null) {
            log.error("repository %s not found", names[0]);
            //TODO: do better error handleling
            throw new NoSuchElementException();
       }

       return Component.builder()
           .name(names[1])
           .url(String.format("%s/charts/%s-%s.tgz", repo.getUrl(), names[1], version))
           .username(repo.getUsername())
           .password(repo.getPassword())
           .build();
    }

    private Map<String, Repository> getRepositories(CoreV1Api api) throws ApiException, JsonProcessingException {
        final String repositoriesBlob = getConfigMap(api, "repositories").get("repositories.json");
        if (repositoriesBlob == null || repositoriesBlob.isEmpty()) {
            log.error("repositories json configuration not found");
            //TODO: do better error handleling
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

    private void launchHelmJob(String componentName, List<String> cmd) throws Exception {
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
        final V1Job responseJob = response.getData();
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
