package co.airy.core.api.components.installer;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import co.airy.log.AiryLoggerFactory;
import io.kubernetes.client.openapi.ApiClient;

@Service
public class CatalogHandler implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {

    private static final Logger log = AiryLoggerFactory.getLogger(CatalogHandler.class);

    private final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private final File repoFolder;
    private final ApiClient apiClient;
    private final String namespace;
    private final String catalogUri;
    private Git git;

    CatalogHandler(
            ApiClient apiClient,
            @Value("${kubernetes.namespace}") String namespace,
            @Value("${catalog.uri}") String catalogUri,
            @Value("${catalog.directory}") String catalogDir) {
        this.apiClient = apiClient;
        this.namespace = namespace;
        this.catalogUri = catalogUri;
        this.repoFolder = new File(catalogDir);
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


    //TODO: Add return value and correct exception handleling and return value
    public void listComponents() throws Exception {
        git.pull();

        List<Map<String, Object>> components = Stream.of(repoFolder.listFiles())
            .filter(f -> f.isDirectory())
            .map(File::getAbsoluteFile)
            //TODO: hanlde other description languages
            .map(f -> new File(f, "description.yaml"))
            .map(f -> {
                Map<String, Object> config = null;
                try {
                    config = mapper.readValue(f, new TypeReference<Map<String, Object>>(){});
                } catch(IOException e) {
                    log.error("unable to read config %s", e);
                }

                return config;
            })
            .filter(c -> c != null)
            .collect(Collectors.toList());

        //FIXME: remove log
        log.info(components.toString());
    }
}
