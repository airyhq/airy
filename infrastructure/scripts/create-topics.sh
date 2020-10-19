#!/bin/bash

# It creates Kafka topics which don't exist yet in a cluster, but are in the topics.sh

RELEASE_NAME=airy
ZOOKEEPER=${RELEASE_NAME}-cp-zookeeper:2181
PARTITIONS=${PARTITIONS:-10}
REPLICAS=${REPLICAS:-2}

while ! nc -z airy-cp-kafka 9092; do sleep 15; echo "Waiting for kafka to start..."; done
while ! nc -z airy-cp-zookeeper 2181; do sleep 10; echo "Waiting for Zookeeper to start..."; done


echo "Dumping topics..."
kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application_communication_channels

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application_communication_messages

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application_communication_metadata

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application_communication_read-receipt

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application_communication_tags

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic application_communication_webhooks

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic ops_application_health

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source_facebook_events

kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic source_facebook_transformed-events
