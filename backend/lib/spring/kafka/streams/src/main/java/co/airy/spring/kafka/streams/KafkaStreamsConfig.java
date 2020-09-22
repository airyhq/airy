package co.airy.spring.kafka.streams;

import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.kafka.streams.MetadataService;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.kstream.Transformer;
import org.apache.kafka.streams.kstream.TransformerSupplier;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.javatuples.Pair;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaStreamsConfig {

    @Value("${kafka.cleanup:false}")
    private boolean cleanup;

    @Value("${kafka.cache.max.bytes:1048576000}") // 1000 * 1024 * 1024
    private long cacheMaxBytes;

    @Value("${kafka.commit-interval-ms:30000}")
    private long commitIntervalMs;

    @Value("${kafka.suppress-interval-ms:0}")
    private long suppressIntervalMs;

    @Value("${kafka.streams.thread.count:4}")
    private int streamsThreadCount;

    @Value("${kafka.rpc-host:}")
    private String rpcHost;

    @Value("${kafka.rpc-port:0}")
    private int rpcPort;

    @Value("${kafka.session.timeout.ms:30000}")
    private int sessionTimeoutMs;

    @Value("${kafka.heartbeat.interval.ms:10000}")
    private int heartbeatIntervalMs;

    @Value("${kafka.poll.ms:100}")
    private int pollMs;

    @Value("${kafka.max.poll.records:1000}")
    private int maxPollRecords;

    @Value("${kafka.buffered.records.per.partition:1000}")
    private int bufferedRecordsPerPartition;

    @Value("${max.request.size:35840000}")
    private int maxRequestSize;

    @Value("${fetch.max.bytes:35840000}")
    private int fetchMaxBytes;

    @Value("${buffer.memory:33554432}")
    private long bufferMemory;

    @Bean
    @Lazy
    public KafkaStreamsWrapper airyKafkaStreams(@Value("${kafka.brokers}") final String brokers, @Value("${kafka.schema-registry-url}") final String schemaRegistryUrl) {
        return new KafkaStreamsWrapper(brokers, schemaRegistryUrl)
            .withCommitIntervalInMs(commitIntervalMs)
            .withSuppressIntervalInMs(suppressIntervalMs)
            .withThreadCount(streamsThreadCount)
            .withAppServerHost(rpcHost)
            .withAppServerPort(rpcPort)
            .withCleanup(cleanup)
            .withCacheMaxBytes(cacheMaxBytes)
            .withSessionTimeoutMs(sessionTimeoutMs)
            .withHeartbeatIntervalMs(heartbeatIntervalMs)
            .withPollMs(pollMs)
            .withMaxPollRecords(maxPollRecords)
            .withMaxRequestSize(maxRequestSize)
            .withFetchMaxBytes(fetchMaxBytes)
            .withBufferMemory(bufferMemory)
            .withBufferedRecordsPerPartition(bufferedRecordsPerPartition);
    }

    @Bean
    @Lazy
    public MetadataService metadataService(@Value("${kafka.brokers}") final String brokers, @Value("${kafka.schema-registry-url}") final String schemaRegistryUrl) {
        return new MetadataService(airyKafkaStreams(brokers, schemaRegistryUrl));
    }

    @Bean
    public <K, V> TransformerSupplier<K, V, KeyValue<K, Pair<V, Map<String, String>>>> headerExtractorTransformerSupplier() {

        return new TransformerSupplier<K, V, KeyValue<K, Pair<V, Map<String, String>>>>() {
            @Override
            public Transformer<K, V, KeyValue<K, Pair<V, Map<String, String>>>> get() {
                return new Transformer<K, V, KeyValue<K, Pair<V, Map<String, String>>>>() {

                    private ProcessorContext context;

                    @Override
                    public void init(ProcessorContext processorContext) {
                        this.context = processorContext;
                    }

                    @Override
                    public KeyValue<K, Pair<V, Map<String, String>>> transform(K k, V v) {
                        final Map<String, String> headers = new HashMap<>();

                        context.headers().forEach(
                            header -> headers.put(header.key(), new String(header.value()))
                        );

                        return KeyValue.pair(k, Pair.with(v, headers));
                    }

                    @Override
                    public void close() {

                    }
                };
            }
        };
    }

    /**
     * Enriches an incoming record with context.timestamp()
     * https://kafka.apache.org/21/javadoc/index.html?org/apache/kafka/streams/processor/ProcessorContext.html#timestamp
     */
    @Bean
    @Qualifier("timestampExtractor")
    public <K, V> TransformerSupplier<K, V, KeyValue<K, Pair<V, Long>>> timestampExtractorTransformerSupplier() {

        return new TransformerSupplier<K, V, KeyValue<K, Pair<V, Long>>>() {
            @Override
            public Transformer<K, V, KeyValue<K, Pair<V, Long>>> get() {
                return new Transformer<K, V, KeyValue<K, Pair<V, Long>>>() {

                    private ProcessorContext context;

                    @Override
                    public void init(ProcessorContext processorContext) {
                        this.context = processorContext;
                    }

                    @Override
                    public KeyValue<K, Pair<V, Long>> transform(K k, V v) {
                        return KeyValue.pair(k, Pair.with(v, context.timestamp()));
                    }

                    @Override
                    public void close() {

                    }
                };
            }
        };
    }
}
