package co.airy.kafka.core.deserializer;

import co.airy.kafka.core.serdes.HybridObjectMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import java.util.Arrays;

public class KafkaJacksonDeserializer implements Deserializer<Object> {

    private static final ObjectMapper OBJECT_MAPPER = new HybridObjectMapper();

    KafkaJacksonDeserializer() {
    }

    @Override
    public Object deserialize(String s, byte[] bytes) throws SerializationException {
        try {
            return OBJECT_MAPPER.readValue(Arrays.copyOfRange(bytes, 1, bytes.length), Object.class);
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }
}
