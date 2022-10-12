package co.airy.core.api.components.installer;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiResponse;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Job;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import co.airy.core.api.components.installer.HelmJobHandler;
import co.airy.core.api.components.installer.NotCompletedException;
import co.airy.core.api.components.installer.model.ComponentDetails;
import co.airy.log.AiryLoggerFactory;

@Service
public class CatalogHandler implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {

    private static final Logger log = AiryLoggerFactory.getLogger(CatalogHandler.class);

    private final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private final File repoFolder;
    private final String catalogUri;
    private final ApiClient apiClient;
    private final String namespace;
    private final HelmJobHandler helmJobHandler;
    private Git git;

    CatalogHandler(
            ApiClient apiClient,
            HelmJobHandler helmJobHandler,
            @Value("${catalog.uri}") String catalogUri,
            @Value("${catalog.directory}") String catalogDir,
            @Value("${kubernetes.namespace}") String namespace) {
        this.apiClient = apiClient;
        this.catalogUri = catalogUri;
        this.repoFolder = new File(catalogDir);
        this.helmJobHandler = helmJobHandler;
        this.namespace = namespace;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        try {
            git = Git.cloneRepository()
                .setURI(catalogUri)
                .setDirectory(repoFolder)
                .call();
        } catch (GitAPIException e) {
            throw new IllegalStateException("not able to clone catalog repository", e);
        }
    }

    @Override
    public void destroy() {
        if (repoFolder != null) {
            repoFolder.delete();
        }
    }

    public List<ComponentDetails> listComponents() throws Exception {
        return getComponents((s -> true));
    }

    public ComponentDetails getComponentByName(String componentName) throws Exception {
        return getComponents((s -> s.equals(componentName)))
            .stream()
            .findAny()
            //TODO: throws exception instead
            .orElse(null);
    }

    //TODO: Add return value and correct exception handleling and return value
    private List<ComponentDetails> getComponents(Function<String, Boolean> condition) throws Exception {
        git.pull();
        final Map<String, Boolean> installedComponents = getInstalledComponents();

        final List<ComponentDetails> components = Stream.of(repoFolder.listFiles())
                .filter(f -> f.isDirectory() && !f.isHidden() && condition.apply(f.getName()))
                .map(File::getAbsoluteFile)
                //TODO: hanlde other description languages
                .map(f -> new File(f, "description.yaml"))
                .map(f -> {
                    ComponentDetails config = null;
                    try {
                        config = mapper.readValue(f, ComponentDetails.class);
                    } catch(IOException e) {
                        log.error("unable to read config %s", e);
                    }

                    return config;
                })
                .filter(c -> c != null)
                .map(c -> c.add("installed", installedComponents.getOrDefault(c.getName(), Boolean.FALSE)))
                .collect(Collectors.toList());

        return components;
    }

    private Map<String, Boolean> getInstalledComponents() throws Exception {

        ArrayList<String> cmd = new ArrayList<>();
        cmd.add("sh");
        cmd.add("-c");
        cmd.add(String.format(
                    "helm -n %s list | awk '{print $1}' | tail -n +2",
                    namespace));

        final V1Job job = helmJobHandler.launchHelmJob("helm-installed", cmd);
        final CoreV1Api api = new CoreV1Api(apiClient);
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
        final String jobName = listResponse
                .getData()
                .getItems()
                .stream()
                .map(V1Pod::getMetadata)
                .filter(m -> m.getLabels().get("job-name").equals(job.getMetadata().getName()))
                .map(V1ObjectMeta::getName)
                .findAny()
                .orElse("");

        if (jobName.isEmpty()) {
            //TODO: handle and throws exception
            return null;
        }

        helmJobHandler.waitForCompletedStatus(api, jobName, job.getMetadata().getNamespace());

        final ApiResponse<String> response = api.readNamespacedPodLogWithHttpInfo(
                jobName,
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

        //TODO: handle non 200 resposnes
        return Arrays.asList(response.getData().split("\\n"))
                .stream()
                .collect(Collectors.toMap(e -> e, e -> true));
    }
}
