package co.airy.kafka.core;

import co.airy.kafka.core.deserializer.KafkaHybridDeserializer;
import co.airy.log.AiryLoggerFactory;
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Properties;


public class KafkaConsumerWrapper<K, V> {
    private static final Logger log = AiryLoggerFactory.getLogger(KafkaConsumerWrapper.class);

    private final Properties props = new Properties();

    private KafkaConsumer<K, V> consumer;

    public KafkaConsumerWrapper(final String brokers, final String schemaRegistryUrl) {
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaHybridDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaHybridDeserializer.class);
        props.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl);
        props.put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true);
    }

    public void subscribe(final String appId, final Collection<String> topics) {
        props.put(ConsumerConfig.GROUP_ID_CONFIG, appId);

        consumer = new KafkaConsumer<>(props);

        consumer.subscribe(topics);
    }

    public ConsumerRecords<K, V> poll(Duration timeout) {
        return consumer.poll(timeout);
    }

    public void commitAsync() {
        consumer.commitAsync((offsets, exception) -> {
            if (exception != null) {
                log.error("Failed to commit offsets for app: " + props.getProperty(ConsumerConfig.GROUP_ID_CONFIG), exception);
            }
        });
    }

    public void close() {
        consumer.close(Duration.of(10, ChronoUnit.SECONDS));
    }

    public void wakeup() {
        consumer.wakeup();
    }
}
