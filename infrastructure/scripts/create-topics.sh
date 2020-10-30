#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

ZOOKEEPER=airy-cp-zookeeper:2181
PARTITIONS=${PARTITIONS:-10}
REPLICAS=${REPLICAS:-1}

kubectl scale statefulset airy-cp-zookeeper --replicas=1
/root/wait-for-service.sh airy-cp-zookeeper 2181 10 Zookeeper
kubectl scale statefulset airy-cp-kafka --replicas=1 
/root/wait-for-service.sh airy-cp-kafka 9092 10 Kafka

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
