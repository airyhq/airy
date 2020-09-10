package backend.lib.kafka.test.src.main.java.co.airy.kafka.test;

import co.airy.kafka.core.deserializer.KafkaHybridDeserializer;
import co.airy.kafka.core.serializer.KafkaHybridSerializer;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig;
import lombok.Data;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.test.TestUtils;
import org.mockito.Mockito;
import org.springframework.util.SocketUtils;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static java.util.stream.Collectors.toList;

public class TestHelper {
    private SchemaRegistryServer schemaRegistryServer;
    private SharedKafkaTestResource sharedKafkaTestResource;
    private List<Topic> topics;
    private static final long MAX_WAIT_MS = 30_000;
    private static String DEFAULT_ERROR = "Error";

    private final String consumerId = UUID.randomUUID().toString();

    private KafkaConsumer consumer;
    private List<ConsumerRecord> buffer = new ArrayList<>();

    private KafkaProducer producer;

    public TestHelper() {
    }

    public TestHelper(SharedKafkaTestResource sharedKafkaTestResource, Topic... topics) {
        this.topics = Arrays.asList(topics);
        this.schemaRegistryServer = new SchemaRegistryServer(SocketUtils.findAvailableTcpPort(), sharedKafkaTestResource.getZookeeperConnectString(), sharedKafkaTestResource.getKafkaConnectString());
        this.sharedKafkaTestResource = sharedKafkaTestResource;
    }

    public void beforeAll() throws Exception {
        schemaRegistryServer.start();
        System.setProperty("kafka.brokers", sharedKafkaTestResource.getKafkaConnectString());
        System.setProperty("kafka.schema-registry-url", schemaRegistryServer.getUrl());
        for (Topic topic : topics) {
            Topic mock = Mockito.mock(topic.getClass());
            String topicName = topic.name();
            sharedKafkaTestResource.createTopic(topicName, 1, (short) 1);

            Mockito.when(mock.name()).thenReturn(topicName + "whatever");
        }

        Properties consumerConfig = TestUtils.consumerConfig(sharedKafkaTestResource.getKafkaConnectString(), KafkaHybridDeserializer.class, KafkaHybridDeserializer.class);
        consumerConfig.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryServer.getUrl());
        consumerConfig.put("specific.avro.reader", true);
        consumerConfig.put(ConsumerConfig.GROUP_ID_CONFIG, consumerId);

        consumer = new KafkaConsumer<>(consumerConfig);

        consumer.subscribe(topics.stream().map(Topic::name).collect(toList()));

        Properties producerConfig = TestUtils.producerConfig(sharedKafkaTestResource.getKafkaConnectString(), KafkaHybridSerializer.class, KafkaHybridSerializer.class);
        producerConfig.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryServer.getUrl());

        producer = new KafkaProducer<>(producerConfig);
    }

    public void afterAll() throws Exception {
        schemaRegistryServer.stop();
    }

    public <K, V> List<ConsumerRecord<K, V>> consumeRecords(int expected, String... topics) {
        return consumeRecords(null, expected, topics);
    }

    public <K, V> List<ConsumerRecord<K, V>> consumeRecords(String key, int expected, String... topics) {
        final List<ConsumerRecord<K, V>> recordsInTopic = new ArrayList<>();

        final List<String> topicNames = List.of(topics);

        if (buffer.size() > 0) {
            final Iterator<ConsumerRecord> iterator = buffer.iterator();
            while (recordsInTopic.size() < expected && iterator.hasNext()) {
                ConsumerRecord consumerRecord = iterator.next();
                if (topicNames.contains(consumerRecord.topic()) && (key == null || key.equals(consumerRecord.key()))) {
                    recordsInTopic.add(consumerRecord);
                }
            }
            buffer.removeAll(recordsInTopic);

            if (recordsInTopic.size() == expected) {
                return recordsInTopic;
            }
        }

        //try
        int retries = 0;
        ConsumerRecords<K, V> records;
        do {
            records = consumer.poll(Duration.ofSeconds(1));
            records.iterator().forEachRemaining(record -> {
                if (topicNames.contains(record.topic()) && (key == null || key.equals(record.key())) && recordsInTopic.size() < expected) {
                    recordsInTopic.add(record);
                } else {
                    buffer.add(record);
                }
            });
            consumer.commitAsync();
        } while (recordsInTopic.size() < expected && retries++ < 30);

        return recordsInTopic;
    }

    public <K, V> List<V> consumeValues(int expected, String... topics) {
        List<ConsumerRecord<K, V>> records = consumeRecords(expected, topics);

        return records.stream().map(ConsumerRecord::value).collect(toList());
    }

    public <T, S> void produceRecords(List<ProducerRecord<T, S>> records) throws ExecutionException, InterruptedException {
        for (ProducerRecord<T, S> record : records) {
            producer.send(record).get();
        }
    }

    public String getSchemaRegistryServerUrl() {
        return schemaRegistryServer.getUrl();
    }

    public void waitForCondition(RunnableTest runnableTest) throws InterruptedException {
        _waitForCondition(runnableTest, MAX_WAIT_MS, DEFAULT_ERROR);
    }

    public void waitForCondition(RunnableTest runnableTest, long maxWaitMs) throws InterruptedException {
        _waitForCondition(runnableTest, maxWaitMs, DEFAULT_ERROR);
    }

    public void waitForCondition(RunnableTest runnableTest, String conditionDetails) throws InterruptedException {
        _waitForCondition(runnableTest, MAX_WAIT_MS, conditionDetails);
    }

    public void waitForCondition(RunnableTest runnableTest, long maxWaitMs, String conditionDetails) throws InterruptedException {
        _waitForCondition(runnableTest, maxWaitMs, conditionDetails);
    }

    private void _waitForCondition(RunnableTest runnableTest, long maxWaitMs, String conditionDetails) throws InterruptedException {
        ThrowableContainer container = new ThrowableContainer();

        TestUtils.waitForCondition(
            () -> {
                try {
                    runnableTest.test();
                    return true;
                } catch (Throwable throwable) {
                    container.setThrowable(new Exception(conditionDetails + ". Original exception:\n" + throwable.getMessage(), throwable));
                }
                return false;
            },
            maxWaitMs,
            () -> container.getThrowable().toString()
        );
    }

    @Data
    private static class ThrowableContainer {
        Throwable throwable = new Throwable();
    }
}
