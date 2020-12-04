package co.airy.kafka.streams;

import co.airy.kafka.core.serdes.KafkaHybridSerde;
import co.airy.log.AiryLoggerFactory;
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StoreQueryParameters;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.errors.InvalidStateStoreException;
import org.apache.kafka.streams.errors.LogAndContinueExceptionHandler;
import org.apache.kafka.streams.errors.StreamsException;
import org.apache.kafka.streams.processor.StateRestoreListener;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.apache.kafka.streams.state.StreamsMetadata;
import org.slf4j.Logger;

import java.net.ServerSocket;
import java.net.Socket;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;


public class KafkaStreamsWrapper {
    private static final Logger log = AiryLoggerFactory.getLogger(KafkaStreamsWrapper.class);

    private final HealthCheckRunner healthCheckRunnerThread;

    private final String brokers;
    private final String schemaRegistryUrl;
    private long commitIntervalInMs;
    private long suppressIntervalInMs;
    private int threadCount;
    private boolean cleanup;
    private int sessionTimeoutMs;
    private int replicationFactor;
    private int heartbeatIntervalMs;
    private int pollMs;
    private int maxPollRecords;
    private int bufferedRecordsPerPartition;
    private int maxRequestSize;
    private int fetchMaxBytes;
    private long cacheMaxBytes;
    private String defaultKeySerde = KafkaHybridSerde.class.getName();
    private String defaultValueSerde = KafkaHybridSerde.class.getName();
    private boolean excludeInternalTopics = true;

    private long bufferMemory;

    private String host;
    private int port;

    private KafkaStreams streams;

    private final boolean testMode;

    public KafkaStreamsWrapper(final String brokers, final String schemaRegistryUrl) {
        this.brokers = brokers;
        this.schemaRegistryUrl = schemaRegistryUrl;
        testMode = System.getenv("TEST_TARGET") != null;
        healthCheckRunnerThread = new HealthCheckRunner(testMode);
    }

    public KafkaStreamsWrapper withCommitIntervalInMs(final long commitIntervalInMs) {
        this.commitIntervalInMs = commitIntervalInMs;
        return this;
    }

    public KafkaStreamsWrapper withSuppressIntervalInMs(final long suppressIntervalInMs) {
        this.suppressIntervalInMs = suppressIntervalInMs;
        return this;
    }

    public KafkaStreamsWrapper withThreadCount(final int threadCount) {
        this.threadCount = threadCount;
        return this;
    }

    public KafkaStreamsWrapper withAppServerHost(final String host) {
        this.host = host;
        return this;
    }

    public KafkaStreamsWrapper withAppServerPort(final int port) {
        this.port = port;
        return this;
    }

    public KafkaStreamsWrapper withCleanup(final boolean cleanup) {
        this.cleanup = cleanup;
        return this;
    }

    public KafkaStreamsWrapper withCacheMaxBytes(final long cacheMaxBytes) {
        this.cacheMaxBytes = cacheMaxBytes;
        return this;
    }

    public KafkaStreamsWrapper withSessionTimeoutMs(int sessionTimeoutMs) {
        this.sessionTimeoutMs = sessionTimeoutMs;
        return this;
    }

    public KafkaStreamsWrapper withReplicationFactor(int replicationFactor) {
        this.replicationFactor = replicationFactor;
        return this;
    }

    public KafkaStreamsWrapper withHeartbeatIntervalMs(int heartbeatIntervalMs) {
        this.heartbeatIntervalMs = heartbeatIntervalMs;
        return this;
    }

    public KafkaStreamsWrapper withPollMs(int pollMs) {
        this.pollMs = pollMs;
        return this;
    }

    public KafkaStreamsWrapper withMaxRequestSize(int maxRequestSize) {
        this.maxRequestSize = maxRequestSize;
        return this;
    }

    public KafkaStreamsWrapper withFetchMaxBytes(int fetchMaxBytes) {
        this.fetchMaxBytes = fetchMaxBytes;
        return this;
    }

    public KafkaStreamsWrapper withBufferMemory(long bufferMemory) {
        this.bufferMemory = bufferMemory;
        return this;
    }

    public KafkaStreamsWrapper withMaxPollRecords(int maxPollRecords) {
        this.maxPollRecords = maxPollRecords;
        return this;
    }

    public KafkaStreamsWrapper withBufferedRecordsPerPartition(int bufferedRecordsPerPartition) {
        this.bufferedRecordsPerPartition = bufferedRecordsPerPartition;
        return this;
    }

    public KafkaStreamsWrapper withDefaultKeySerde(String className) {
        this.defaultKeySerde = className;

        return this;
    }

    public KafkaStreamsWrapper withDefaultValueSerde(String className) {
        this.defaultValueSerde = className;

        return this;
    }

    public long getSuppressIntervalInMs() {
        return suppressIntervalInMs;
    }

    public KafkaStreamsWrapper withExcludeInternalTopics(boolean excludeInternalTopicsConfig) {
        this.excludeInternalTopics = excludeInternalTopicsConfig;
        return this;
    }

    public <T> ReadOnlyKeyValueStore<String, T> acquireLocalStore(String storeName) {
        int retries = 0;
        do
            try {
                return streams.store(StoreQueryParameters.fromNameAndType(storeName, QueryableStoreTypes.keyValueStore()));
            } catch (InvalidStateStoreException e) {
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException expected) {
                }
            }
        while (retries++ < 10);

        throw new StoreNotReadyException(storeName);
    }

    public void close() {
        log.info("stop");

        healthCheckRunnerThread.stopRunning();

        if (testMode) {
            streams.close(Duration.ofMillis(1));
        } else {
            streams.close();
        }
    }

    public synchronized void start(final Topology topology, final String appId) throws IllegalStateException, StreamsException {
        final Properties props = new Properties();

        //Default Properties
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, appId);
        props.put(StreamsConfig.CLIENT_ID_CONFIG, appId);
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl);
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, defaultKeySerde);
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, defaultValueSerde);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, testMode ? 4 : threadCount);
        props.put(StreamsConfig.DEFAULT_DESERIALIZATION_EXCEPTION_HANDLER_CLASS_CONFIG, LogAndContinueExceptionHandler.class);
        props.put(StreamsConfig.STATE_CLEANUP_DELAY_MS_CONFIG, Long.MAX_VALUE);

        props.put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, this.maxRequestSize);
        props.put(ConsumerConfig.FETCH_MAX_BYTES_CONFIG, this.fetchMaxBytes);

        if (testMode) {
            props.put(StreamsConfig.STATE_DIR_CONFIG, System.getenv("TEST_TMPDIR"));
        }

        props.put(StreamsConfig.producerPrefix(ProducerConfig.RETRIES_CONFIG), Integer.MAX_VALUE);
        props.put(StreamsConfig.producerPrefix(ProducerConfig.MAX_BLOCK_MS_CONFIG), Integer.MAX_VALUE);

        props.put(StreamsConfig.consumerPrefix(ConsumerConfig.MAX_POLL_RECORDS_CONFIG), maxPollRecords);
        props.put(StreamsConfig.consumerPrefix(ConsumerConfig.MAX_PARTITION_FETCH_BYTES_CONFIG), Integer.MAX_VALUE);
        props.put(StreamsConfig.BUFFERED_RECORDS_PER_PARTITION_CONFIG, bufferedRecordsPerPartition);
        props.put(StreamsConfig.POLL_MS_CONFIG, pollMs);

        props.put(StreamsConfig.consumerPrefix(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG), sessionTimeoutMs);
        props.put(StreamsConfig.consumerPrefix(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG), heartbeatIntervalMs);

        props.put(StreamsConfig.REPLICATION_FACTOR_CONFIG, testMode ? 1 : this.replicationFactor);

        props.put(StreamsConfig.producerPrefix(ProducerConfig.COMPRESSION_TYPE_CONFIG), "lz4");

        // Unlimited buffer for sending large aggregates
        props.put(StreamsConfig.producerPrefix(ProducerConfig.BUFFER_MEMORY_CONFIG), this.bufferMemory);

        props.put(StreamsConfig.ROCKSDB_CONFIG_SETTER_CLASS_CONFIG, CustomRocksDbConfig.class);

        //Custom Properties
        if (0 < commitIntervalInMs) {
            props.put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, commitIntervalInMs);
        }

        if (!"".equals(host) && 0 < port) {
            props.put(StreamsConfig.APPLICATION_SERVER_CONFIG, host + ":" + port);
        }

        props.put(StreamsConfig.consumerPrefix(ConsumerConfig.EXCLUDE_INTERNAL_TOPICS_CONFIG), excludeInternalTopics);

        props.put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, cacheMaxBytes);

        streams = new KafkaStreams(topology, props);

        streams.setStateListener(new KafKaStreamStateListener(this));

        streams.setGlobalStateRestoreListener(new LoggingStateRestoreListener());

        if (cleanup) {
            log.info("cleaning up before starting");
            streams.cleanUp();
        }

        log.info("start");
        final Runtime runtime = Runtime.getRuntime();
        log.info(String.format("available cpus: %s total memory: %s free memory: %s max memory: %s", runtime.availableProcessors(), runtime.totalMemory(), runtime.freeMemory(), runtime.totalMemory()));
        log.info("topology: \n" + topology.describe());

        streams.start();

        healthCheckRunnerThread.start();
    }

    public final KafkaStreams.State state() {
        return streams.state();
    }

    <K> StreamsMetadata metadataForKey(String store, K key, Serializer<K> serializer) {
        return streams.metadataForKey(store, key, serializer);
    }

    private static final class LoggingStateRestoreListener implements StateRestoreListener {

        private final Map<TopicPartition, Instant> toRestore = new ConcurrentHashMap<>();

        @Override
        public void onRestoreStart(TopicPartition topicPartition, String store, long start, long end) {
            toRestore.put(topicPartition, Instant.now());
        }

        @Override
        public void onBatchRestored(TopicPartition topicPartition, String store, long start, long batchCompleted) {
        }

        @Override
        public void onRestoreEnd(TopicPartition topicPartition, String store, long totalRestored) {
            long seconds = ChronoUnit.SECONDS.between(toRestore.get(topicPartition), Instant.now());
            log.info("Restoration completed for {} on topic-partition {} in {}", store, topicPartition, seconds);
        }
    }

    private static final class KafKaStreamStateListener implements KafkaStreams.StateListener {

        private final KafkaStreamsWrapper kafkaStreamsWrapper;

        private KafKaStreamStateListener(KafkaStreamsWrapper kafkaStreamsWrapper) {
            this.kafkaStreamsWrapper = kafkaStreamsWrapper;
        }

        @Override
        public void onChange(KafkaStreams.State newState, KafkaStreams.State oldState) {
            log.info("state went from {} to {}", oldState.name(), newState.name());

            if (KafkaStreams.State.ERROR.equals(newState) || KafkaStreams.State.PENDING_SHUTDOWN.equals(newState) || KafkaStreams.State.NOT_RUNNING.equals(newState)) {
                kafkaStreamsWrapper.healthCheckRunnerThread.stopRunning();
            }
        }
    }

    private static final class HealthCheckRunner extends Thread {

        HealthCheckRunner(boolean testMode) {
            this.shouldRun = !testMode;
        }

        private boolean shouldRun;

        private ServerSocket serverSocket;

        @Override
        public void run() {
            try {
                serverSocket = new ServerSocket(6000);

                while (shouldRun) {
                    final Socket socket = serverSocket.accept();
                    socket.close();
                }
            } catch (Exception e) {
                log.error("Failed to open tcp port or accept connections!", e);
                stopRunning();
            }
        }

        void stopRunning() {
            this.shouldRun = false;
            if (serverSocket != null) {
                try {
                    serverSocket.close();
                } catch (Exception e) {
                    log.error("Failed to close socket!", e);
                }
            }
        }
    }
}
