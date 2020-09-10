package backend.lib.kafka.test.src.main.java.co.airy.kafka.test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

class FileHelper {
    static File createTempDirectory() {
        final File logDir;
        try {
            logDir = Files.createTempDirectory("kafka-unit").toFile();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        logDir.deleteOnExit();

        return logDir;
    }
}
