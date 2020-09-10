package backend.lib.kafka.core.src.main.java.co.airy.kafka.core.deserializer;

import co.airy.kafka.core.serdes.HybridObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import java.util.Arrays;
import java.util.Map;

import static co.airy.kafka.core.serdes.KafkaHybridSerde.MAGIC_BYTE;

public class KafkaJacksonDeserializer implements Deserializer<Object> {

    private static final ObjectMapper OBJECT_MAPPER = new HybridObjectMapper();

    KafkaJacksonDeserializer() {
    }

    /**
     * here we can configure the object mapper for best performance
     *
     * @param configs configs
     * @param isKey   isKey
     */
    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
    }

    @Override
    public Object deserialize(String s, byte[] bytes) throws SerializationException {
        try {
            //double check
            if (MAGIC_BYTE != bytes[0]) {
                throw new SerializationException("bytes to be deserialized are incompatible with KafkaHybridSerde");
            }

            return OBJECT_MAPPER.readValue(Arrays.copyOfRange(bytes, 1, bytes.length), Object.class);
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }

    @Override
    public void close() {
    }
}
