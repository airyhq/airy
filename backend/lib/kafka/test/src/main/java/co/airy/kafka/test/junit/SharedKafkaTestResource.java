package co.airy.kafka.test.junit;

import co.airy.kafka.test.KafkaTestCluster;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.extension.AfterAllCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.util.Properties;

@Slf4j
public class SharedKafkaTestResource implements BeforeAllCallback, AfterAllCallback {
    private KafkaTestCluster kafkaTestCluster;

    private final Properties brokerProperties = new Properties();

    public SharedKafkaTestResource() {
        this(new Properties());
    }

    public SharedKafkaTestResource(final Properties brokerProperties) {
        this.brokerProperties.putAll(brokerProperties);
    }

    public void createTopic(String topicName, int partitions, short replicationFactor) {
        validateState(true, "Cannot access Kafka before service has been started.");
        kafkaTestCluster.createTopic(topicName, partitions, replicationFactor);
    }

    public String getZookeeperConnectString() {
        validateState(true, "Cannot access Zookeeper before service has been started.");
        return kafkaTestCluster.getZookeeperConnectString();
    }

    public String getKafkaConnectString() {
        validateState(true, "Cannot access Kafka before service has been started.");
        return kafkaTestCluster.getKafkaConnectString();
    }


    private void validateState(final boolean shouldKafkaExistYet, final String errorMessage) throws IllegalStateException {
        if (shouldKafkaExistYet && kafkaTestCluster == null) {
            throw new IllegalStateException(errorMessage);
        } else if (!shouldKafkaExistYet && kafkaTestCluster != null) {
            throw new IllegalStateException(errorMessage);
        }
    }

    @Override
    public void beforeAll(ExtensionContext context) throws Exception {
        log.info("Starting kafka test server");

        validateState(false, "Unknown State! Kafka Test Server already exists!");

        kafkaTestCluster = new KafkaTestCluster(1, brokerProperties);

        kafkaTestCluster.start();
    }

    @Override
    public void afterAll(ExtensionContext context) {
        log.info("Shutting down kafka test server");

        if (kafkaTestCluster == null) {
            return;
        }

        try {
            kafkaTestCluster.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
