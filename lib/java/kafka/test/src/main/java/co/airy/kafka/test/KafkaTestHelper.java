package co.airy.kafka.test;

import co.airy.kafka.core.deserializer.KafkaHybridDeserializer;
import co.airy.kafka.core.serializer.KafkaHybridSerializer;
import co.airy.kafka.schema.Topic;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.test.TestUtils;
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

public class KafkaTestHelper {
    private final SchemaRegistryTestServer schemaRegistryTestServer;
    private final SharedKafkaTestResource sharedKafkaTestResource;
    private final List<Topic> topics;

    private final String consumerId = UUID.randomUUID().toString();
    private final List<ConsumerRecord> buffer = new ArrayList<>();

    private KafkaConsumer consumer;
    private KafkaProducer producer;

    public KafkaTestHelper(SharedKafkaTestResource sharedKafkaTestResource, Topic... topics) {
        this.topics = Arrays.asList(topics);
        this.schemaRegistryTestServer = new SchemaRegistryTestServer(SocketUtils.findAvailableTcpPort(), sharedKafkaTestResource.getZookeeperConnectString(), sharedKafkaTestResource.getKafkaConnectString());
        this.sharedKafkaTestResource = sharedKafkaTestResource;
    }

    public void beforeAll() throws Exception {
        schemaRegistryTestServer.start();
        System.setProperty("kafka.brokers", sharedKafkaTestResource.getKafkaConnectString());
        System.setProperty("kafka.schema-registry-url", schemaRegistryTestServer.getUrl());
        for (Topic topic : topics) {
            String topicName = topic.name();
            sharedKafkaTestResource.createTopic(topicName, 1, (short) 1);
        }

        Properties consumerConfig = TestUtils.consumerConfig(sharedKafkaTestResource.getKafkaConnectString(), KafkaHybridDeserializer.class, KafkaHybridDeserializer.class);
        consumerConfig.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryTestServer.getUrl());
        consumerConfig.put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true);
        consumerConfig.put(ConsumerConfig.GROUP_ID_CONFIG, consumerId);

        consumer = new KafkaConsumer<>(consumerConfig);

        consumer.subscribe(topics.stream().map(Topic::name).collect(toList()));

        Properties producerConfig = TestUtils.producerConfig(sharedKafkaTestResource.getKafkaConnectString(), KafkaHybridSerializer.class, KafkaHybridSerializer.class);
        producerConfig.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryTestServer.getUrl());

        producer = new KafkaProducer<>(producerConfig);
    }

    public void afterAll() throws Exception {
        schemaRegistryTestServer.stop();
    }

    public <K, V> List<ConsumerRecord<K, V>> consumeRecords(int expected, String... topics) {
        return consumeRecords(null, expected, topics);
    }

    public <K, V> List<ConsumerRecord<K, V>> consumeRecords(String key, int expected, String... topics) {
        final List<ConsumerRecord<K, V>> recordsInTopic = new ArrayList<>();

        final List<String> topicNames = List.of(topics);

        // It's faster to have one consumer that reads from all topics simultaneously.
        // Therefore when test code only requests some of the topics we store records from all other topics in a buffer
        // so that something like this can work:
        // aRecords = testHelper.consumeRecords(1, topicA)
        // bRecords = testHelper.consumeRecords(1, topicB)
        // If there was no buffer, the first call would discard all the records expected in the second call
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

        int retries = 0;
        do {
            ConsumerRecords<K, V> records = consumer.poll(Duration.ofSeconds(1));
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

    public <T, S> void produceRecord(ProducerRecord<T, S> record) throws ExecutionException, InterruptedException {
        producer.send(record).get();
    }

    public <T, S> void produceRecords(List<ProducerRecord<T, S>> records) throws ExecutionException, InterruptedException {
        for (ProducerRecord<T, S> record : records) {
            produceRecord(record);
        }
    }
}
