package co.airy.kafka.core.deserializer;

import co.airy.kafka.core.serdes.Configurations;
import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.io.Serializable;
import java.util.Map;

import static co.airy.kafka.core.serdes.KafkaHybridSerde.AIRY_MAGIC_BYTE;

/**
 * A hybrid kafka deserializer supporting Avro (with Schema Registry), and Json
 */
public class KafkaHybridDeserializer implements Deserializer<Serializable> {

    private static final byte SCHEMA_REGISTRY_MAGIC_BYTE = 0x0;

    private final KafkaAvroDeserializer avroDeserializer;
    private final KafkaJacksonDeserializer jacksonDeserializer;
    private final StringDeserializer stringDeserializer;

    private boolean isDeserializerForRecordKeys;

    public KafkaHybridDeserializer() {
        avroDeserializer = new KafkaAvroDeserializer();
        jacksonDeserializer = new KafkaJacksonDeserializer();
        stringDeserializer = new StringDeserializer();
    }

    @Override
    public void configure(final Map<String, ?> deserializerConfig,
                          final boolean isDeserializerForRecordKeys) {
        avroDeserializer.configure(
                Configurations.withSpecificAvroEnabled(deserializerConfig),
                isDeserializerForRecordKeys);
        jacksonDeserializer.configure(deserializerConfig, isDeserializerForRecordKeys);
        stringDeserializer.configure(deserializerConfig, isDeserializerForRecordKeys);

        this.isDeserializerForRecordKeys = isDeserializerForRecordKeys;
    }

    @Override
    public Serializable deserialize(final String topic, final byte[] bytes) throws SerializationException {
        if (bytes == null) {
            return null;
        }

        if (isDeserializerForRecordKeys) {
            return SCHEMA_REGISTRY_MAGIC_BYTE == bytes[0] ? (Serializable) avroDeserializer.deserialize(topic, bytes) : stringDeserializer.deserialize(topic, bytes);
        }

        switch (bytes[0])  {
            case AIRY_MAGIC_BYTE:
                return (Serializable) jacksonDeserializer.deserialize(topic, bytes);
            case SCHEMA_REGISTRY_MAGIC_BYTE:
                return (Serializable) avroDeserializer.deserialize(topic, bytes);
            default:
                return stringDeserializer.deserialize(topic, bytes);
        }
    }

    @Override
    public void close() {
        avroDeserializer.close();
        jacksonDeserializer.close();
        stringDeserializer.close();
    }
}
