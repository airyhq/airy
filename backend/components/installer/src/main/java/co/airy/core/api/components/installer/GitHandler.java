package co.airy.core.api.components.installer;

import java.io.File;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class GitHandler implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {

    private final String catalogUri;
    private final File repoFolder;
    private Git git;

    GitHandler(
            @Value("${catalog.uri}") String catalogUri,
            @Value("${catalog.directory}") String catalogDir) {
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

    public List<File> getComponentsDescriptionFiles(Function<String, Boolean> condition) {
        git.pull();

        return Stream.of(repoFolder.listFiles())
            .filter(f -> f.isDirectory() && !f.isHidden() && condition.apply(f.getName()))
            .map(File::getAbsoluteFile)
            .map(f -> new File(f, "description.yaml"))
            .collect(Collectors.toList());
    }

    @Override
    public void destroy() {
        if (repoFolder != null) {
            repoFolder.delete();
        }
    }
}
