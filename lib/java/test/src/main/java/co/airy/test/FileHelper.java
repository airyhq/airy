package co.airy.test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class FileHelper {
    public static File createTempDirectory() {
        final File logDir;
        try {
            logDir = Files.createTempDirectory("airy-core-test").toFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        logDir.deleteOnExit();

        return logDir;
    }
}
