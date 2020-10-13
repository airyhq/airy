#!/bin/bash

# It creates Kafka topics which don't exist yet in a cluster, but are in the topics.sh

RELEASE_NAME=airy
ZOOKEEPER=${RELEASE_NAME}-cp-zookeeper:2181
KAFKAS=${RELEASE_NAME}-cp-kafka-headless:9092
PARTITIONS=${PARTITIONS:-10}
REPLICAS=${REPLICAS:-2}
TOPICS_FILE="/tmp/topics"

source $(dirname "$0")/topics.sh

echo "Dumping topics..."
kafka-topics --zookeeper $ZOOKEEPER --list | grep -vEi "repartition|changelog" > $TOPICS_FILE

echo "Inspecting which topics to create..."
for topic in ${sourceTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${communicationTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${opsTopicsShortLived[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config retention.ms=3600000
fi
done
