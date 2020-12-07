package co.airy.kafka.core.serdes;

import co.airy.kafka.core.serializer.AvroGenericArraySerializer;
import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.cfg.MutableConfigOverride;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.module.afterburner.AfterburnerModule;

import java.util.List;
import java.util.Map;

public class HybridObjectMapper extends ObjectMapper {

    public HybridObjectMapper() {
        activateDefaultTyping(LaissezFaireSubTypeValidator.instance, DefaultTyping.EVERYTHING);

        setSerializationInclusion(JsonInclude.Include.NON_NULL);

        addMixIn(org.apache.avro.Schema.class, IgnoreAvro.class);
        addMixIn(org.apache.avro.specific.SpecificData.class, IgnoreAvro.class);

        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        final MutableConfigOverride maoConfigOverride = configOverride(Map.class);
        maoConfigOverride.setInclude(JsonInclude.Value.construct(JsonInclude.Include.NON_NULL, JsonInclude.Include.NON_NULL));

        addMixIn(List.class, GenericDataArrayMixIn.class);

        registerModule(new AfterburnerModule());
    }

    @JsonSerialize(using = AvroGenericArraySerializer.class)
    private abstract static class GenericDataArrayMixIn {
    }

    @JsonIgnoreType
    private static class IgnoreAvro {
    }

}
