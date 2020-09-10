package backend.lib.kafka.core.src.main.java.co.airy.kafka.core.deserializer;

import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import io.confluent.kafka.streams.serdes.avro.AiryConfigurationUtils;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.io.Serializable;
import java.util.Map;

import static co.airy.kafka.core.serdes.KafkaHybridSerde.MAGIC_BYTE;
import static io.confluent.kafka.serializers.AiryKafkaAvroSerDe.KAFKA_MAGIC_BYTE;

/**
 * A hybrid kafka deserializer supporting Avro (with Schema Registry), and Json
 *
 */
public class KafkaHybridDeserializer implements Deserializer<Serializable> {

    private final KafkaAvroDeserializer innerAvro;
    private final KafkaJacksonDeserializer innerJackson;
    private final StringDeserializer innerString;

    private boolean isDeserializerForRecordKeys;

    public KafkaHybridDeserializer() {
        innerAvro = new KafkaAvroDeserializer();
        innerJackson = new KafkaJacksonDeserializer();
        innerString = new StringDeserializer();
    }

    @Override
    public void configure(final Map<String, ?> deserializerConfig,
                          final boolean isDeserializerForRecordKeys) {
        innerAvro.configure(
            AiryConfigurationUtils.withSpecificAvroEnabled(deserializerConfig),
            isDeserializerForRecordKeys);
        innerJackson.configure(deserializerConfig, isDeserializerForRecordKeys);
        innerString.configure(deserializerConfig, isDeserializerForRecordKeys);

        this.isDeserializerForRecordKeys = isDeserializerForRecordKeys;
    }

    @Override
    public Serializable deserialize(final String topic, final byte[] bytes) throws SerializationException {
        if (bytes == null) {
            return null;
        }

        final Serializable t;

        if (isDeserializerForRecordKeys) {
            if (KAFKA_MAGIC_BYTE == bytes[0]) {
                t = (Serializable) innerAvro.deserialize(topic, bytes);
            } else {
                t = innerString.deserialize(topic, bytes);
            }
        } else {
            //if the first byte if the AIRY MAGIC_BYTE, the record is a Jackson record and should be deserialized with innerJackson
            if (MAGIC_BYTE == bytes[0]) {
                t = (Serializable) innerJackson.deserialize(topic, bytes);
            } else if (KAFKA_MAGIC_BYTE == bytes[0]) { //Any other type of record will get deserialized with innerAvro
                t = (Serializable) innerAvro.deserialize(topic, bytes);
            } else { //string values written by external sources (like debezium connector)
                t = innerString.deserialize(topic, bytes);
            }
        }

        return t;
    }

    @Override
    public void close() {
        innerAvro.close();
        innerJackson.close();
        innerString.close();
    }
}
