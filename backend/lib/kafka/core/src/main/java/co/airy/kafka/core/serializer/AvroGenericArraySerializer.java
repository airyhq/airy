package co.airy.kafka.core.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.core.type.WritableTypeId;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AvroGenericArraySerializer extends JsonSerializer<List<Object>> {
    @Override
    public void serialize(List array, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        for (Object obj : array) {
            jsonGenerator.writeObject(obj);
        }
    }

    @Override
    public void serializeWithType(List value, JsonGenerator gen, SerializerProvider serializers, TypeSerializer typeSer) throws IOException {
        final ArrayList<Object> copy = new ArrayList<Object>(value);
        WritableTypeId typeId = typeSer.typeId(copy, JsonToken.START_ARRAY);
        typeSer.writeTypePrefix(gen, typeId);
        serialize(value, gen, serializers); // call your customized serialize method
        typeSer.writeTypeSuffix(gen, typeId);
    }
}
