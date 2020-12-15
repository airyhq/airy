package co.airy.kafka.core.serdes;

import co.airy.kafka.core.deserializer.KafkaHybridDeserializer;
import co.airy.kafka.core.serializer.KafkaHybridSerializer;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;

import java.io.Serializable;
import java.util.Map;

public class KafkaHybridSerde implements Serde<Serializable> {

  private final Serde<Serializable> serde;

  public static final byte AIRY_MAGIC_BYTE = 0x8;

  public KafkaHybridSerde() {
    serde = Serdes.serdeFrom(new KafkaHybridSerializer(), new KafkaHybridDeserializer());
  }

  public Serializer<Serializable> serializer() {
    return serde.serializer();
  }

  public Deserializer<Serializable> deserializer() {
    return serde.deserializer();
  }

  public void configure(final Map<String, ?> serdeConfig, final boolean isSerdeForRecordKeys) {
    serde.serializer().configure(serdeConfig, isSerdeForRecordKeys);
    serde.deserializer().configure(serdeConfig, isSerdeForRecordKeys);
  }

  public void close() {
    serde.serializer().close();
    serde.deserializer().close();
  }

}
