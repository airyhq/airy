package backend.lib.kafka.core.src.main.java.co.airy.kafka.core.serializer;

import co.airy.kafka.core.serdes.HybridObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;

import java.io.ByteArrayOutputStream;
import java.util.Map;

import static co.airy.kafka.core.serdes.KafkaHybridSerde.MAGIC_BYTE;

public class KafkaJacksonSerializer implements Serializer<Object> {

    private static final ObjectMapper OBJECT_MAPPER = new HybridObjectMapper();

    KafkaJacksonSerializer() {}

    /**
     * here we can configure the object mapper for best performance
     *
     * @param configs configs
     * @param isKey isKey
     */
    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {}

    @Override
    public byte[] serialize(String topic, Object data) throws SerializationException {
        try (final ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            out.write(MAGIC_BYTE);
            OBJECT_MAPPER.writeValue(out, data);

            return out.toByteArray();
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }

    @Override
    public void close() {}
}
