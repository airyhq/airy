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
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;

import java.util.Properties;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.common.config.SslConfigs;
import java.util.HashMap;

@Configuration
@PropertySource("classpath:kafka-core.properties")
public class KafkaCoreConfig {
    @Bean
    @Lazy
    @Scope("prototype")
    public <K, V> KafkaProducer<K, V> kafkaProducer(@Value("${kafka.brokers}") final String brokers, @Value("${kafka.schema-registry-url}") final String schemaRegistryUrl,
                                                    @Value("${AUTH_JAAS:#{null}}") final String jaasConfig,
                                                    @Value("${KAFKA_KEY_TRUST_SECRET:#{null}}") final String kafkaKeyTrustSecret) {
        final Properties props = new Properties();

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaHybridSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaHybridSerializer.class);
        props.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl);

        if (jaasConfig != null) {
            props.put("security.protocol", "SASL_SSL");
            props.put("sasl.mechanism", "PLAIN");
            props.put("sasl.jaas.config", jaasConfig);
        }

        if (kafkaKeyTrustSecret != null) {
            props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SSL");
            props.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, "/opt/kafka/certs/client.truststore.jks");
            props.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, kafkaKeyTrustSecret);
            props.put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, "PKCS12");
            props.put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "/opt/kafka/certs/client.keystore.p12");
            props.put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, kafkaKeyTrustSecret);
            props.put(SslConfigs.SSL_KEY_PASSWORD_CONFIG, kafkaKeyTrustSecret);
        }

        return new KafkaProducer<>(props);
    }

    @Bean
    @Lazy
    @Scope("prototype")
    public <K, V> KafkaConsumerWrapper<K, V> kafkaConsumer(@Value("${kafka.brokers}") final String brokers, @Value("${kafka.schema-registry-url}") final String schemaRegistryUrl,
                                                           @Value("${kafka.sasl.jaas.config:#{null}}") final String jaasConfig,
                                                           @Value("${KAFKA_KEY_TRUST_SECRET:#{null}}") final String kafkaKeyTrustSecret) {
        return new KafkaConsumerWrapper<K, V>(brokers, schemaRegistryUrl)
                .withAuthJaas(jaasConfig, kafkaKeyTrustSecret);
    }
}
