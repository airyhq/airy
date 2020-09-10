package backend.lib.kafka.core.src.main.java.io.confluent.kafka.streams.serdes.avro;

import java.util.Map;

/**
 * This class serves the purpose of using the ConfigurationUtils.withSpecificAvroEnabled functionality
 * from confluent kafka, which is package protected, in our custom serdes
 */
public class AiryConfigurationUtils {

    public static Map<String, Object> withSpecificAvroEnabled(final Map<String, ?> serializerConfig) {
        return ConfigurationUtils.withSpecificAvroEnabled(serializerConfig);
    }

}
