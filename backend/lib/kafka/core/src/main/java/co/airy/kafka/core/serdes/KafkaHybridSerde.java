package co.airy.kafka.core.serdes;

import co.airy.kafka.core.deserializer.KafkaHybridDeserializer;
import co.airy.kafka.core.serializer.KafkaHybridSerializer;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;

import java.io.Serializable;
import java.util.Map;


/**
 * A hybrid serde to be used in kafka stream apps.
 * It makes use of a hybrid serializer and a hybrid deserializer, each supporting both Avro and Json
 *
 */
public class KafkaHybridSerde implements Serde<Serializable> {

  private final Serde<Serializable> inner;

  public final static byte MAGIC_BYTE = 0x8;

  public KafkaHybridSerde() {
    inner = Serdes.serdeFrom(new KafkaHybridSerializer(), new KafkaHybridDeserializer());
  }

  public Serializer<Serializable> serializer() {
    return inner.serializer();
  }

  public Deserializer<Serializable> deserializer() {
    return inner.deserializer();
  }

  public void configure(final Map<String, ?> serdeConfig, final boolean isSerdeForRecordKeys) {
    inner.serializer().configure(serdeConfig, isSerdeForRecordKeys);
    inner.deserializer().configure(serdeConfig, isSerdeForRecordKeys);
  }

  public void close() {
    inner.serializer().close();
    inner.deserializer().close();
  }

}
