#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

ZOOKEEPER=airy-cp-zookeeper:2181
PARTITIONS=${PARTITIONS:-10}
REPLICAS=${REPLICAS:-1}

while ! nc -z airy-cp-kafka 9092; do sleep 15; echo "Waiting for kafka to start..."; done
while ! nc -z airy-cp-zookeeper 2181; do sleep 10; echo "Waiting for Zookeeper to start..."; done

# TODO make sure the minimum number of kafkas are there before we deploy core topics
sleep 1m

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.channels

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.messages --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.metadata --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.read-receipt

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.tags --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.webhooks

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic ops.application.health --config retention.ms=3600000

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source.facebook.events

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source.facebook.transformed-events
