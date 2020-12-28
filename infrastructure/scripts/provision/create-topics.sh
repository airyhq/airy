#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

ZOOKEEPER=airy-cp-zookeeper:2181
PARTITIONS=${PARTITIONS:-10}
REPLICAS=${REPLICAS:-1}
AIRY_CORE_NAMESPACE=${AIRY_CORE_NAMESPACE:-}

echo "Creating Kafka topics"

if [ -n "${AIRY_CORE_NAMESPACE}" ]
then
    AIRY_CORE_NAMESPACE="${AIRY_CORE_NAMESPACE}."
	echo "Using ${AIRY_CORE_NAMESPACE} to namespace topics"
fi

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}application.communication.channels" 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}application.communication.messages" --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}application.communication.metadata" --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}application.communication.read-receipt" 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}application.communication.tags" --config cleanup.policy=compact min.compaction.lag.ms=86400000 segment.bytes=10485760 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}application.communication.webhooks" 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}ops.application.health" --config retention.ms=3600000 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}source.facebook.events" 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}source.google.events" 1>/dev/null

kafka-topics --create --if-not-exists --zookeeper ${ZOOKEEPER} --replication-factor ${REPLICAS} --partitions ${PARTITIONS} --topic "${AIRY_CORE_NAMESPACE}source.twilio.events" 1>/dev/null
