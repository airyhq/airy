package co.airy.kafka.test;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.CreateTopicsResult;
import org.apache.kafka.clients.admin.DescribeClusterResult;
import org.apache.kafka.clients.admin.KafkaAdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.Node;
import org.apache.kafka.common.errors.TopicExistsException;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Slf4j
public class KafkaTestCluster implements AutoCloseable {
    private final Clock clock = Clock.systemUTC();

    private final ZookeeperTestServer zkTestServer = new ZookeeperTestServer();

    private final int numberOfBrokers;

    private final Properties overrideBrokerProperties = new Properties();

    private final List<KafkaTestServer> brokers = new ArrayList<>();

    public KafkaTestCluster(int numberOfBrokers, Properties overrideBrokerProperties) {
        this.numberOfBrokers = numberOfBrokers;
        this.overrideBrokerProperties.putAll(overrideBrokerProperties);
    }

    public void start() throws Exception {
        zkTestServer.start();

        if (brokers.isEmpty()) {
            for (int brokerId = 1; brokerId <= numberOfBrokers; brokerId++) {
                final Properties brokerProperties = new Properties();

                brokerProperties.putAll(overrideBrokerProperties);

                brokerProperties.put("broker.id", String.valueOf(brokerId));

                brokers.add(new KafkaTestServer(brokerProperties, zkTestServer));
            }
        }

        for (KafkaTestServer broker : brokers) {
            broker.start();
        }

        waitUntilClusterReady();
    }

    public String getKafkaConnectString() {
        // If we have no brokers yet, the cluster has not yet started.
        if (brokers.isEmpty()) {
            throw new IllegalStateException("Cannot access brokers before cluster has been started.");
        }

        return brokers.stream().map(KafkaTestServer::getKafkaConnectString).collect(Collectors.joining(","));
    }

    public String getZookeeperConnectString() {
        return zkTestServer.getConnectString();
    }

    public void stop() {
        for (KafkaTestServer kafkaBroker : brokers) {
            kafkaBroker.stop();
        }

        zkTestServer.stop();
    }

    @Override
    public void close() {
        stop();
    }

    private void waitUntilClusterReady() throws TimeoutException {
        long startTime = clock.millis();
        int numberOfBrokersReady = 0;
        do {
            try {
                Collection<Node> nodes = describeClusterNodes();

                if (nodes.size() >= numberOfBrokers) {
                    log.info("Found {} brokers on-line, cluster is ready.", nodes.size());
                    return;
                }

                if (nodes.size() > numberOfBrokersReady) {
                    numberOfBrokersReady = nodes.size();
                    log.info(
                            "Found {} of {} brokers ready, continuing to wait for cluster to start.",
                            numberOfBrokersReady,
                            nodes.size()
                    );
                }

                Thread.sleep(100);
            } catch (final InterruptedException exception) {
                break;
            }
        }
        while (clock.millis() <= startTime + (long) 10_000);

        // If we got here, throw timeout exception
        throw new TimeoutException("Cluster failed to come online within " + (long) 10_000 + " milliseconds.");
    }

    public void createTopic(final String topicName, final int partitions, final short replicationFactor) {
        try (AdminClient adminClient = getAdminClient()) {
            NewTopic newTopic = new NewTopic(topicName, partitions, replicationFactor);

            CreateTopicsResult createTopicsResult = adminClient.createTopics(Collections.singleton(newTopic));

            createTopicsResult.values().get(topicName).get();
        } catch (InterruptedException | ExecutionException e) {
            if (!(e.getCause() instanceof TopicExistsException)) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }
    }

    private List<Node> describeClusterNodes() {
        try (AdminClient adminClient = getAdminClient()) {
            DescribeClusterResult describeClusterResult = adminClient.describeCluster();
            return new ArrayList<>(describeClusterResult.nodes().get());
        } catch (final InterruptedException | ExecutionException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private AdminClient getAdminClient() {
        String kafkaConnectString = getKafkaConnectString();

        Map<String, Object> defaultClientConfig = new HashMap<>();
        defaultClientConfig.put("bootstrap.servers", kafkaConnectString);
        defaultClientConfig.put("client.id", "test-consumer-id");
        defaultClientConfig.put("request.timeout.ms", 15_000);

        return KafkaAdminClient.create(defaultClientConfig);
    }
}
