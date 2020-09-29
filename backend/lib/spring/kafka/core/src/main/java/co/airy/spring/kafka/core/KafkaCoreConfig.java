package co.airy.spring.kafka.core;

import co.airy.kafka.core.KafkaConsumerWrapper;
import co.airy.kafka.core.serializer.KafkaHybridSerializer;
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;

import java.util.Properties;

@Configuration
public class KafkaCoreConfig {
    @Bean
    @Lazy
    @Scope("prototype")
    public <K, V> KafkaProducer<K, V> kafkaProducer(@Value("${kafka.brokers}") final String brokers, @Value("${kafka.schema-registry-url}") final String schemaRegistryUrl) {
        final Properties props = new Properties();

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaHybridSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaHybridSerializer.class);
        props.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl);

        return new KafkaProducer<>(props);
    }

    @Bean
    @Lazy
    @Scope("prototype")
    public <K, V> KafkaConsumerWrapper<K, V> kafkaConsumer(@Value("${kafka.brokers}") final String brokers, @Value("${kafka.schema-registry-url}") final String schemaRegistryUrl) {
        return new KafkaConsumerWrapper<>(brokers, schemaRegistryUrl);
    }
}
