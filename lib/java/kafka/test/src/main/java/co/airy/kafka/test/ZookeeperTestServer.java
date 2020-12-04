package co.airy.kafka.test;

import co.airy.test.FileHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.curator.test.InstanceSpec;
import org.apache.curator.test.TestingServer;

import java.io.IOException;

@Slf4j
public class ZookeeperTestServer implements AutoCloseable {

    private TestingServer zkServer = null;

    public void start() {
        try {
            if (zkServer == null) {
                // Define configuration
                InstanceSpec zkInstanceSpec = new InstanceSpec(
                    FileHelper.createTempDirectory(),
                    -1,
                    -1,
                    -1,
                    false,
                    -1,
                    -1,
                    1000
                );

                log.info("Starting Zookeeper test server");
                zkServer = new TestingServer(zkInstanceSpec, true);
            } else {
                log.info("Restarting Zookeeper test server");
                zkServer.restart();
            }
        } catch (final Exception exception) {
            throw new RuntimeException(exception.getMessage(), exception);
        }
    }

    public void restart() {
        // If we have no instance yet
        if (zkServer == null) {
            // Call start instead and return.
            start();
            return;
        }

        // Otherwise call restart.
        try {
            zkServer.restart();
        } catch (final Exception exception) {
            throw new RuntimeException(exception.getMessage(), exception);
        }
    }

    public void stop() {
        log.info("Shutting down zookeeper test server");

        if (zkServer != null) {
            try {
                zkServer.stop();
            } catch (final IOException exception) {
                throw new RuntimeException(exception.getMessage(), exception);
            }
        }
    }

    @Override
    public void close() {
        stop();
    }

    String getConnectString() {
        if (zkServer == null) {
            throw new IllegalStateException("Cannot get connect string before service is started.");
        }
        return zkServer.getConnectString();
    }
}
