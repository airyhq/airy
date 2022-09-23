#!/bin/bash
set -eo pipefail

BROKER_ID=$(echo "${POD_NAME}" | awk -F "-" '{ print $NF; }')
BROKER_PORT=$((AIRY_FIRST_LISTENER_PORT + BROKER_ID))
LISTENERS="${AIRY_LISTENERS//AIRY_BROKER_PORT/${BROKER_PORT}}"
ADVERTISED_LISTENERS=$(echo "${AIRY_ADVERTISED_LISTENERS}" | \
  sed "s/AIRY_POD_NAME/${POD_NAME}/g" | \
  sed "s/AIRY_NAMESPACE/${POD_NAMESPACE}/g" | \
  sed "s/AIRY_HOST_IP/${HOST_IP}/g" | \
  sed "s/AIRY_BROKER_PORT/${BROKER_PORT}/g")

# Insert runtime configuration
{ 
  echo "broker.id=${BROKER_ID}"
  echo "listeners=${LISTENERS}"
  echo "advertised.listeners=${ADVERTISED_LISTENERS}"
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
