package co.airy.kafka.test;

import io.confluent.kafka.schemaregistry.CompatibilityLevel;
import io.confluent.kafka.schemaregistry.rest.SchemaRegistryConfig;
import io.confluent.kafka.schemaregistry.rest.SchemaRegistryRestApplication;
import org.apache.kafka.common.security.auth.SecurityProtocol;
import org.eclipse.jetty.server.Server;

import java.util.Properties;

public class SchemaRegistryTestServer {
    private final Properties prop;
    private Server restServer;
    private String url;

    public SchemaRegistryTestServer(int port, String zookeeperConnectionUrl, String brokersList) {
        prop = new Properties();
        prop.put(SchemaRegistryConfig.KAFKASTORE_SECURITY_PROTOCOL_CONFIG, SecurityProtocol.PLAINTEXT.name);
        prop.put(SchemaRegistryConfig.LISTENERS_CONFIG, "http://localhost:" + port);
        prop.put(SchemaRegistryConfig.KAFKASTORE_CONNECTION_URL_CONFIG, zookeeperConnectionUrl);
        prop.put(SchemaRegistryConfig.KAFKASTORE_BOOTSTRAP_SERVERS_CONFIG, brokersList);
        prop.put(SchemaRegistryConfig.KAFKASTORE_TOPIC_CONFIG, "_schemas");
        prop.put(SchemaRegistryConfig.SCHEMA_COMPATIBILITY_CONFIG, CompatibilityLevel.NONE.name);
        prop.put(SchemaRegistryConfig.MASTER_ELIGIBILITY, true);
    }

    public void start() throws Exception {
        SchemaRegistryRestApplication restApp = new SchemaRegistryRestApplication(prop);
        restServer = restApp.createServer();
        restServer.start();
        url = restServer.getURI().toString();
        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
    }

    public void stop() throws Exception {
        if (restServer != null) {
            restServer.stop();
            restServer.join();
        }
    }

    public String getUrl() {
        return url;
    }
}
