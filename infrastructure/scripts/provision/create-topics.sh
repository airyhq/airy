#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

ZOOKEEPER=airy-cp-zookeeper:2181
PARTITIONS=${PARTITIONS:-10}
REPLICAS=${REPLICAS:-1}

echo "Creating Kafka topics..."

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.channels 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.messages --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.metadata --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.read-receipt 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.tags --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application.communication.webhooks 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic ops.application.health --config retention.ms=3600000 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source.facebook.events 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source.google.events 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source.twilio.events 1>/dev/null
