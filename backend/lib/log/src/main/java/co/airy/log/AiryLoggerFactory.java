package backend.lib.log.src.main.java.co.airy.log;


import co.airy.kafka.schema.ops.OpsApplicationLogs;
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
        LoggerContext ctx = (LoggerContext) LogManager.getContext(false);
        Configuration config = ctx.getConfiguration();

        LoggerConfig rootLogger = config.getRootLogger();

        String kafkaBrokers = System.getenv("KAFKA_BROKERS");
        if (kafkaBrokers == null) {
            kafkaBrokers = System.getProperty("kafka.brokers");
        }
        OpsApplicationLogs opsApplicationLogs = new OpsApplicationLogs();

        JsonLayout.Builder jsonLayoutBuilder = JsonLayout.newBuilder();
        DefaultConfiguration defaultConfiguration = new DefaultConfiguration();
        KeyValuePair[] additionalFields = {
            new KeyValuePair("appName", "${env:DD_SERVICE_NAME}"),
            new KeyValuePair("timestamp", "${date:yyyy-MM-dd HH:mm:ss}")
        };
        JsonLayout jsonLayout = ((JsonLayout.Builder) ((JsonLayout.Builder) jsonLayoutBuilder
            .setAdditionalFields(additionalFields)
            .setConfiguration(defaultConfiguration))
            .setProperties(true))
            .build();

        Property[] properties = {Property.createProperty("bootstrap.servers", kafkaBrokers)};

        KafkaAppender.Builder kafkaAppenderBuilder = KafkaAppender.newBuilder();
        KafkaAppender kafkaAppender = ((KafkaAppender.Builder) kafkaAppenderBuilder
            .setTopic(opsApplicationLogs.name())
            .setIgnoreExceptions(true)
            .setName("kafka")
            .setConfiguration(config)
            .setLayout(jsonLayout)
            .setPropertyArray(properties))
            .build();

        kafkaAppender.start();

        rootLogger.addAppender(kafkaAppender, rootLogger.getLevel(), rootLogger.getFilter());
    }
}
