#!/bin/bash
set -eo pipefail

ZOOKEEPER_SERVERS=$(echo "${ZOOKEEPER_SERVERS}" | tr ";" " ")
ZOOKEEPER_ID=$(echo "${POD_NAME}" | awk -F "-" '{ print $NF; }')
ZOOKEEPER_SERVER_ID=$((ZOOKEEPER_ID+1))

echo "${ZOOKEEPER_SERVER_ID}" > /var/lib/zookeeper/data/myid

# Insert runtime configuration
COUNT=1
for SERVER in ${ZOOKEEPER_SERVERS}; do
    if [ ${COUNT} -eq ${ZOOKEEPER_SERVER_ID} ]; then
        echo "server.${COUNT}=0.0.0.0:2888:3888" >> /etc/kafka/zookeeper.properties
    else
        echo "server.${COUNT}=${SERVER}" >> /etc/kafka/zookeeper.properties
    fi
    COUNT=$((COUNT+1))
done

cat /etc/kafka/zookeeper.properties
