package co.airy.kafka.core.serdes;

import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;

import java.util.HashMap;
import java.util.Map;

public class Configurations {

    public static Map<String, ?> withSpecificAvroEnabled(final Map<String, ?> serializerConfig) {
        Map<String, Object> config = serializerConfig == null ? new HashMap<>() : new HashMap<>(serializerConfig);

        config.put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true);
        return config;
    }

}
