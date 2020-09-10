package backend.lib.kafka.core.src.main.java.co.airy.kafka.core.serializer;

import io.confluent.kafka.serializers.KafkaAvroSerializer;
import io.confluent.kafka.streams.serdes.avro.AiryConfigurationUtils;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.io.Serializable;
import java.util.Map;

/**
 * A hybrid kafka serializer supporting Avro (with Schema Registry), and Json
 *
 */
public class KafkaHybridSerializer implements Serializer<Serializable> {

    private final KafkaAvroSerializer innerAvro;
    private final KafkaJacksonSerializer innerJackson;
    private final StringSerializer innerString;

    private boolean isSerializerForRecordKeys;

    public KafkaHybridSerializer() {
        innerAvro = new KafkaAvroSerializer();
        innerJackson = new KafkaJacksonSerializer();
        innerString = new StringSerializer();
    }

    @Override
    public void configure(final Map<String, ?> serializerConfig,
                          final boolean isSerializerForRecordKeys) {
        innerAvro.configure(
            AiryConfigurationUtils.withSpecificAvroEnabled(serializerConfig),
            isSerializerForRecordKeys);
        innerJackson.configure(serializerConfig, isSerializerForRecordKeys);
        innerString.configure(serializerConfig, isSerializerForRecordKeys);

        this.isSerializerForRecordKeys = isSerializerForRecordKeys;
    }

    @Override
    public byte[] serialize(final String topic, final Serializable record) throws SerializationException {
        if (record == null) {
            return null;
        }
        byte[] bytes;

        if (SpecificRecord.class.isAssignableFrom(record.getClass())) {
            bytes = innerAvro.serialize(topic, record);
        } else {
            if (isSerializerForRecordKeys) {
                if (String.class.isAssignableFrom(record.getClass())) {
                    bytes = innerString.serialize(topic, (String) record);
                } else {
                    throw new SerializationException(String.format("Wrong Key Type: %s, Allowed types are SpecificRecord or String", record.getClass()));
                }
            } else {
                bytes = innerJackson.serialize(topic, record);
            }
        }

        return bytes;
    }

    @Override
    public void close() {
        innerAvro.close();
        innerJackson.close();
        innerString.close();
    }
}
