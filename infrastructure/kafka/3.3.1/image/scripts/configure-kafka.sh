#!/bin/bash
set -eo pipefail

BROKER_ID=$(echo "${POD_NAME}" | awk -F "-" '{ print $NF; }')
BROKER_PORT=$((AIRY_FIRST_LISTENER_PORT + BROKER_ID))
CONTROLLER_PORT=$((AIRY_FIRST_CONTROLLER_PORT + BROKER_ID))
LISTENERS=$(echo "${AIRY_LISTENERS}" | \
  sed "s/AIRY_BROKER_PORT/${BROKER_PORT}/g" | \
  sed "s/AIRY_CONTROLLER_PORT/${CONTROLLER_PORT}/g")
ADVERTISED_LISTENERS=$(echo "${AIRY_ADVERTISED_LISTENERS}" | \
  sed "s/AIRY_POD_NAME/${POD_NAME}/g" | \
  sed "s/AIRY_NAMESPACE/${POD_NAMESPACE}/g" | \
  sed "s/AIRY_HOST_IP/${HOST_IP}/g" | \
  sed "s/AIRY_BROKER_PORT/${BROKER_PORT}/g")
CONTROLLER_QUORUM_VOTERS=${AIRY_CONTROLLER_QUORUM_VOTERS}

# Insert runtime configuration
{
  echo "node.id=${BROKER_ID}"
  echo "listeners=${LISTENERS}"
  echo "advertised.listeners=${ADVERTISED_LISTENERS}"
  echo "controller.quorum.voters=${CONTROLLER_QUORUM_VOTERS}"
} >> /etc/kafka/server.properties

# Insert all other KAFKA_* env variables as settings
for VAR in $(env)
do
  if [[ $VAR =~ ^KAFKA_ && ! $VAR =~ ^KAFKA_VERSION && ! $VAR =~ ^KAFKA_[0-9] && ! $VAR =~ ^KAFKA_PORT && ! $VAR =~ ^KAFKA_OPTS && ! $VAR =~ ^KAFKA_SERVICE_ ]]; then
    kafka_name=$(echo "$VAR" | sed -r "s/KAFKA_(.*)=.*/\1/g" | tr '[:upper:]' '[:lower:]' | tr _ .)
    env_var=$(echo "$VAR" | sed -r "s/(.*)=.*/\1/g")
    echo "$kafka_name=${!env_var}" >> /etc/kafka/server.properties
  fi
done

echo "Printing out the broker configuration"
cat /etc/kafka/server.properties

if ! kafka-storage.sh info -c /etc/kafka/server.properties > /dev/null; then
  echo "Cleaning up Kafka..."
  rm -rf /opt/kafka/data-0/logs/__cluster_metadata-0/
  CLUSTER_ID=$(/opt/kafka/bin/kafka-storage.sh random-uuid)
  /opt/kafka/bin/kafka-storage.sh format -t "${CLUSTER_ID}" -c /etc/kafka/server.properties --ignore-formatted
  chown -R 1000 /opt/kafka/
echo "Configuration done, starting Kafka..."
fi
