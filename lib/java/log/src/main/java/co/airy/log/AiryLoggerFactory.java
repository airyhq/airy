package co.airy.log;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AiryLoggerFactory {

    private static boolean configModified = false;

    public static Logger getLogger(Class type) {
        boolean testMode = System.getenv("TEST_TARGET") != null;

        if (!configModified && !testMode) {
            init();
            configModified = true;
        }

        return LoggerFactory.getLogger(type);
    }

    private static void init() {
        // TODO production logging
    }
}
