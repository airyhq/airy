/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package co.airy.core.api.communication.lucene;

import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.processor.internals.ProcessorStateManager;
import org.apache.kafka.streams.processor.internals.RecordCollector;
import org.apache.kafka.streams.state.StateSerdes;

/**
 * This file is copied and licensed as-is from the Kafka Streams source
 * since the underlying class is not public.
 *
 * see https://github.com/apache/kafka/blob/33ba2820f4fbb459172022a83d761a7c674a8fdd/streams/src/main/java/org/apache/kafka/streams/state/internals/StoreChangeLogger.java#L33
 */
class StoreChangeLogger<K, V> {

    private final String topic;
    private final int partition;
    private final ProcessorContext context;
    private final RecordCollector collector;
    private final Serializer<K> keySerializer;
    private final Serializer<V> valueSerializer;

    StoreChangeLogger(final String storeName,
                      final ProcessorContext context,
                      final StateSerdes<K, V> serialization) {
        this(storeName, context, context.taskId().partition, serialization);
    }

    private StoreChangeLogger(final String storeName,
                              final ProcessorContext context,
                              final int partition,
                              final StateSerdes<K, V> serialization) {
        topic = ProcessorStateManager.storeChangelogTopic(context.applicationId(), storeName);
        this.context = context;
        this.partition = partition;
        this.collector = ((RecordCollector.Supplier) context).recordCollector();
        keySerializer = serialization.keySerializer();
        valueSerializer = serialization.valueSerializer();
    }

    void logChange(final K key,
                   final V value) {
        logChange(key, value, context.timestamp());
    }

    void logChange(final K key,
                   final V value,
                   final long timestamp) {
        // Sending null headers to changelog topics (KIP-244)
        collector.send(topic, key, value, null, partition, timestamp, keySerializer, valueSerializer);
    }
}
