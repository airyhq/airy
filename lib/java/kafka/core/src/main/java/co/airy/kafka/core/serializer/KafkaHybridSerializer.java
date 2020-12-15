package co.airy.kafka.core.serializer;

import co.airy.kafka.core.serdes.Configurations;
import io.confluent.kafka.serializers.KafkaAvroSerializer;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.io.Serializable;
import java.util.Map;

/**
 * A hybrid kafka serializer supporting Avro (via Schema Registry), and JSON
 */
public class KafkaHybridSerializer implements Serializer<Serializable> {
    private final KafkaAvroSerializer avroSerializer;
    private final KafkaJacksonSerializer jacksonSerializer;
    private final StringSerializer stringSerializer;

    private boolean isSerializerForRecordKeys;

    public KafkaHybridSerializer() {
        avroSerializer = new KafkaAvroSerializer();
        jacksonSerializer = new KafkaJacksonSerializer();
        stringSerializer = new StringSerializer();
    }

    @Override
    public void configure(final Map<String, ?> serializerConfig,
                          final boolean isSerializerForRecordKeys) {

        avroSerializer.configure(Configurations.withSpecificAvroEnabled(serializerConfig), isSerializerForRecordKeys);
        jacksonSerializer.configure(serializerConfig, isSerializerForRecordKeys);
        stringSerializer.configure(serializerConfig, isSerializerForRecordKeys);

        this.isSerializerForRecordKeys = isSerializerForRecordKeys;
    }

    @Override
    public byte[] serialize(final String topic, final Serializable record) throws SerializationException {
        if (record == null) {
            return null;
        }
        byte[] bytes;

        if (SpecificRecord.class.isAssignableFrom(record.getClass())) {
            bytes = avroSerializer.serialize(topic, record);
        } else {
            if (isSerializerForRecordKeys) {
                if (String.class.isAssignableFrom(record.getClass())) {
                    bytes = stringSerializer.serialize(topic, (String) record);
                } else {
                    throw new SerializationException(String.format("Wrong Key Type: %s, Allowed types are SpecificRecord or String", record.getClass()));
                }
            } else {
                bytes = jacksonSerializer.serialize(topic, record);
            }
        }

        return bytes;
    }

    @Override
    public void close() {
        avroSerializer.close();
        jacksonSerializer.close();
        stringSerializer.close();
    }
}
