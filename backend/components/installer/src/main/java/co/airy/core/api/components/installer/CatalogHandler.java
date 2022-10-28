package co.airy.core.api.components.installer;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

import co.airy.core.api.components.installer.model.ComponentDetails;
import co.airy.core.api.components.installer.model.InstallationStatus;
import co.airy.log.AiryLoggerFactory;

@Service
public class CatalogHandler implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {

    private static final Logger log = AiryLoggerFactory.getLogger(CatalogHandler.class);

    private final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private final File repoFolder;
    private final String catalogUri;
    private final InstalledComponentsHandler installedComponentsHandler;
    private Git git;

    CatalogHandler(
            InstalledComponentsHandler installedComponentsHandler,
            @Value("${catalog.uri}") String catalogUri,
            @Value("${catalog.directory}") String catalogDir) {
        this.catalogUri = catalogUri;
        this.repoFolder = new File(catalogDir);
        this.installedComponentsHandler = installedComponentsHandler;
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


    private List<ComponentDetails> getComponents(Function<String, Boolean> condition) throws Exception {
        git.pull();
        final Map<String, String> installedComponents = installedComponentsHandler.getInstalledComponentsCache();

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
                .map(c -> c.add("installationStatus", installedComponents.getOrDefault(c.getName(), InstallationStatus.uninstalled)))
                .collect(Collectors.toList());

        return components;
    }
}
