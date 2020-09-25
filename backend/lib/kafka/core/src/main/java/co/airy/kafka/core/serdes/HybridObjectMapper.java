package co.airy.kafka.core.serdes;

import co.airy.kafka.core.serializer.AvroGenericArraySerializer;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.cfg.MutableConfigOverride;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.module.afterburner.AfterburnerModule;
import org.javatuples.Decade;
import org.javatuples.Ennead;
import org.javatuples.Octet;
import org.javatuples.Pair;
import org.javatuples.Quartet;
import org.javatuples.Quintet;
import org.javatuples.Septet;
import org.javatuples.Sextet;
import org.javatuples.Triplet;
import org.javatuples.Tuple;

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

        addMixIn(Pair.class, TuplesMixIn.class);
        addMixIn(Tuple.class, TuplesMixIn.class);
        addMixIn(Triplet.class, TuplesMixIn.class);
        addMixIn(Quartet.class, TuplesMixIn.class);
        addMixIn(Quintet.class, TuplesMixIn.class);
        addMixIn(Sextet.class, TuplesMixIn.class);
        addMixIn(Septet.class, TuplesMixIn.class);
        addMixIn(Octet.class, TuplesMixIn.class);
        addMixIn(Ennead.class, TuplesMixIn.class);
        addMixIn(Decade.class, TuplesMixIn.class);

        addMixIn(List.class, GenericDataArrayMixIn.class);

        registerModule(new AfterburnerModule());
    }

    @JsonSerialize(using = AvroGenericArraySerializer.class)
    private abstract static class GenericDataArrayMixIn {
    }

    @JsonIgnoreType
    private static class IgnoreAvro {
    }

    @JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.WRAPPER_ARRAY)
    @JsonIgnoreProperties("size")
    private abstract static class TuplesMixIn {
        @JsonCreator
        public static <A, B> Pair<A, B> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1) {
            return Pair.with(var0, var1);
        }

        @JsonCreator
        public static <A, B, C> Triplet<A, B, C> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                      @JsonProperty("value2") C var2) {
            return Triplet.with(var0, var1, var2);
        }

        @JsonCreator
        public static <A, B, C, D> Quartet<A, B, C, D> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                            @JsonProperty("value2") C var2, @JsonProperty("value3") D var3) {
            return Quartet.with(var0, var1, var2, var3);
        }

        @JsonCreator
        public static <A, B, C, D, E> Quintet<A, B, C, D, E> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                                  @JsonProperty("value2") C var2, @JsonProperty("value3") D var3,
                                                                  @JsonProperty("value4") E var4) {
            return Quintet.with(var0, var1, var2, var3, var4);
        }

        @JsonCreator
        public static <A, B, C, D, E, F> Sextet<A, B, C, D, E, F> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                                       @JsonProperty("value2") C var2, @JsonProperty("value3") D var3,
                                                                       @JsonProperty("value4") E var4, @JsonProperty("value5") F var5) {
            return Sextet.with(var0, var1, var2, var3, var4, var5);
        }

        @JsonCreator
        public static <A, B, C, D, E, F, G> Septet<A, B, C, D, E, F, G> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                                             @JsonProperty("value2") C var2, @JsonProperty("value3") D var3,
                                                                             @JsonProperty("value4") E var4, @JsonProperty("value5") F var5,
                                                                             @JsonProperty("value6") G var6) {
            return Septet.with(var0, var1, var2, var3, var4, var5, var6);
        }

        @JsonCreator
        public static <A, B, C, D, E, F, G, H> Octet<A, B, C, D, E, F, G, H> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                                                  @JsonProperty("value2") C var2, @JsonProperty("value3") D var3,
                                                                                  @JsonProperty("value4") E var4, @JsonProperty("value5") F var5,
                                                                                  @JsonProperty("value6") G var6, @JsonProperty("value7") H var7) {
            return Octet.with(var0, var1, var2, var3, var4, var5, var6, var7);
        }

        @JsonCreator
        public static <A, B, C, D, E, F, G, H, I> Ennead<A, B, C, D, E, F, G, H, I> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                                                         @JsonProperty("value2") C var2, @JsonProperty("value3") D var3,
                                                                                         @JsonProperty("value4") E var4, @JsonProperty("value5") F var5,
                                                                                         @JsonProperty("value6") G var6, @JsonProperty("value7") H var7,
                                                                                         @JsonProperty("value8") I var8) {
            return Ennead.with(var0, var1, var2, var3, var4, var5, var6, var7, var8);
        }

        @JsonCreator
        public static <A, B, C, D, E, F, G, H, I, J> Decade<A, B, C, D, E, F, G, H, I, J> with(@JsonProperty("value0") A var0, @JsonProperty("value1") B var1,
                                                                                               @JsonProperty("value2") C var2, @JsonProperty("value3") D var3,
                                                                                               @JsonProperty("value4") E var4, @JsonProperty("value5") F var5,
                                                                                               @JsonProperty("value6") G var6, @JsonProperty("value7") H var7,
                                                                                               @JsonProperty("value8") I var8, @JsonProperty("value8") J var9) {
            return Decade.with(var0, var1, var2, var3, var4, var5, var6, var7, var8, var9);
        }
    }

}
