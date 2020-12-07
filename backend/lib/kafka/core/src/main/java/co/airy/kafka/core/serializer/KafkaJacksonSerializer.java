package co.airy.kafka.core.serializer;

import co.airy.kafka.core.serdes.HybridObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;

import java.io.ByteArrayOutputStream;

import static co.airy.kafka.core.serdes.KafkaHybridSerde.AIRY_MAGIC_BYTE;

public class KafkaJacksonSerializer implements Serializer<Object> {

    private static final ObjectMapper OBJECT_MAPPER = new HybridObjectMapper();

    @Override
    public byte[] serialize(String topic, Object data) throws SerializationException {
        try (final ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            out.write(AIRY_MAGIC_BYTE);
            OBJECT_MAPPER.writeValue(out, data);

            return out.toByteArray();
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }
}
