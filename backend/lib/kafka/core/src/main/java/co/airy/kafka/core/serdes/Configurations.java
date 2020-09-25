package co.airy.kafka.core.serdes;

import java.util.HashMap;
import java.util.Map;

public class Configurations {

    public static Map<String, ?> withSpecificAvroEnabled(final Map<String, ?> serializerConfig) {
        Map<String, Object> config = serializerConfig == null ? new HashMap<>() : new HashMap<>(serializerConfig);

        config.put("specific.avro.reader", true);
        return config;
    }

}
