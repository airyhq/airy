#!/bin/bash

# It creates Kafka topics which don't exist yet in a cluster, but are in the topics.sh
# Example usage: (from the bastion host) cd ~/bin; ./create-topics.sh
# Note: default values, which can be overwritten with env variables before
# running, REPLICAS=3, PARTITIONS=64. If the topics are there - they will not be
# re-created


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


for topic in ${sourceTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done


for topic in ${failedTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi

done

for topic in ${internalTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config retention.ms=3600000 --config retention.bytes=1000000000 --config cleanup.policy=compact,delete
fi
done

for topic in ${identityTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact
fi
done

for topic in ${identityTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done

for topic in ${communicationTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${migrationTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${communicationTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done

for topic in ${organizationTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${automationTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${automationTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done

for topic in ${organizationTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done

for topic in ${activityTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config retention.ms=1800000
fi
done

for topic in ${sinkTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${contactTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done

for topic in ${contactTopics[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic
fi
done

for topic in ${etlTopicsCompacted[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config cleanup.policy=compact --config segment.bytes=10485760 --config min.compaction.lag.ms=86400000
fi
done

for topic in ${opsTopicsWithRetention[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config retention.ms=2592000000
fi
done

for topic in ${opsTopicsShortLived[@]}; do
if ! grep -q "^$topic$" $TOPICS_FILE
then
  echo "creating $topic"
  kafka-topics --create --zookeeper $ZOOKEEPER --replication-factor $REPLICAS --partitions $PARTITIONS --topic $topic --config retention.ms=3600000
fi
done
