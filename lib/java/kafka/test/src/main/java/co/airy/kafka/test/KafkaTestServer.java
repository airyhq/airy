package co.airy.kafka.test;

import co.airy.test.FileHelper;
import kafka.server.KafkaConfig;
import kafka.server.KafkaServerStartable;
import org.apache.curator.test.InstanceSpec;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class KafkaTestServer implements AutoCloseable {
    private static final String DEFAULT_HOSTNAME = "localhost";

    private KafkaServerStartable broker;

    private KafkaConfig brokerConfig;

    private ZookeeperTestServer zookeeperTestServer;

    private boolean isManagingZookeeper = true;

    private final Properties overrideBrokerProperties = new Properties();

    private final List<String> listenersConnectString = new ArrayList<>();

    private KafkaTestServer(Properties overrideBrokerProperties) throws IllegalArgumentException {
        if (overrideBrokerProperties == null) {
            throw new IllegalArgumentException("Cannot pass null overrideBrokerProperties argument.");
        }

        this.overrideBrokerProperties.putAll(overrideBrokerProperties);
    }

    KafkaTestServer(Properties overrideBrokerProperties, ZookeeperTestServer zookeeperTestServer) {
        this(overrideBrokerProperties);

        if (zookeeperTestServer != null) {
            isManagingZookeeper = false;
        }

        this.zookeeperTestServer = zookeeperTestServer;
    }

    public String getKafkaConnectString() {
        validateState("Cannot get connect string prior to service being started.");

        return String.join(",", listenersConnectString);
    }

    int getBrokerId() {
        validateState("Cannot get brokerId prior to service being started.");
        return brokerConfig.brokerId();
    }

    public void start() {
        if (zookeeperTestServer == null) {
            zookeeperTestServer = new ZookeeperTestServer();
        }

        if (isManagingZookeeper) {
            zookeeperTestServer.restart();
        } else {
            zookeeperTestServer.start();
        }

        if (broker == null) {
            final Properties brokerProperties = new Properties();
            brokerProperties.putAll(overrideBrokerProperties);

            brokerProperties.setProperty("zookeeper.connect", zookeeperTestServer.getConnectString());

            if (brokerProperties.getProperty("log.dir") == null) {
                brokerProperties.setProperty("log.dir", FileHelper.createTempDirectory().getAbsolutePath());
            }

            brokerProperties.setProperty("host.name", getConfiguredHostname());

            brokerProperties.setProperty("auto.create.topics.enable", "true");
            brokerProperties.setProperty("zookeeper.session.timeout.ms", "30000");
            brokerProperties.setProperty("broker.id", "1");
            brokerProperties.setProperty("auto.offset.reset", "latest");

            brokerProperties.setProperty("num.io.threads", "2");
            brokerProperties.setProperty("num.network.threads", "2");
            brokerProperties.setProperty("log.flush.interval.messages", "1");

            brokerProperties.setProperty("offsets.topic.replication.factor", "1");
            brokerProperties.setProperty("offset.storage.replication.factor", "1");
            brokerProperties.setProperty("transaction.state.log.replication.factor", "1");
            brokerProperties.setProperty("transaction.state.log.min.isr", "1");
            brokerProperties.setProperty("transaction.state.log.num.partitions", "4");
            brokerProperties.setProperty("config.storage.replication.factor", "1");
            brokerProperties.setProperty("status.storage.replication.factor", "1");
            brokerProperties.setProperty("default.replication.factor", "1");

            String listenerDefinition = "PLAINTEXT://" + getConfiguredHostname() + ":" + InstanceSpec.getRandomPort();
            listenersConnectString.add(listenerDefinition);

            appendProperty(brokerProperties, "advertised.listeners", listenerDefinition);
            appendProperty(brokerProperties, "listeners", listenerDefinition);

            brokerConfig = new KafkaConfig(brokerProperties);

            broker = new KafkaServerStartable(brokerConfig);
        }

        broker.startup();
    }

    public void stop() {
        close();
    }

    @Override
    public void close() {
        if (broker != null) {
            broker.shutdown();
        }

        if (zookeeperTestServer != null && isManagingZookeeper) {
            zookeeperTestServer.stop();
        }
    }

    private void appendProperty(final Properties properties, final String key, final String appendValue) {
        // Validate inputs
        if (properties == null) {
            throw new NullPointerException("properties argument cannot be null.");
        }
        if (key == null) {
            throw new NullPointerException("key argument cannot be null.");
        }

        String originalValue = properties.getProperty(key);
        if (originalValue != null && !originalValue.isEmpty()) {
            originalValue = originalValue + ", ";
        } else {
            originalValue = "";
        }

        properties.setProperty(key, originalValue + appendValue);
    }

    private String getConfiguredHostname() {
        return overrideBrokerProperties.getProperty("host.name", DEFAULT_HOSTNAME);
    }

    private void validateState(String errorMessage) throws IllegalStateException {
        if (broker == null) {
            throw new IllegalStateException(errorMessage);
        }
    }
}
