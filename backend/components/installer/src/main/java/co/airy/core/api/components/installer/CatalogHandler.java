package co.airy.core.api.components.installer;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import co.airy.core.api.components.installer.model.ComponentDetails;
import co.airy.core.api.components.installer.model.InstallationStatus;
import co.airy.log.AiryLoggerFactory;

@Service
public class CatalogHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(CatalogHandler.class);

    private final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
    private final InstalledComponentsHandler installedComponentsHandler;
    private final GitHandler gitHandler;

    CatalogHandler(
            InstalledComponentsHandler installedComponentsHandler,
            GitHandler gitHandler) {
        this.installedComponentsHandler = installedComponentsHandler;
        this.gitHandler = gitHandler;
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
        final Map<String, String> installedComponents = installedComponentsHandler.getInstalledComponentsCache();

        final List<ComponentDetails> components = gitHandler.getComponentsDescriptionFiles(condition)
                .stream()
                .map(f -> {
                    ComponentDetails config = null;
                    try {
                        config = mapper.readValue(f, ComponentDetails.class);
                    } catch (IOException e) {
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
