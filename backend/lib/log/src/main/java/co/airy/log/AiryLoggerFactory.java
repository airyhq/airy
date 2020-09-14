package co.airy.log;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.appender.mom.kafka.KafkaAppender;
import org.apache.logging.log4j.core.config.Configuration;
import org.apache.logging.log4j.core.config.LoggerConfig;
import org.apache.logging.log4j.core.config.Property;
import org.apache.logging.log4j.core.layout.JsonLayout;
import org.apache.logging.log4j.core.util.KeyValuePair;
import org.apache.logging.log4j.core.config.DefaultConfiguration;
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
