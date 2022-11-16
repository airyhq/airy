#!/bin/bash
set -e

if [[ "$1" == kafka-server-start.sh && "$2" == /etc/kafka/server.properties ]];then
	/root/configure-kafka.sh
else
	echo "Unsupported arguments to docker entrypoint"
	exit 1
fi

su-exec kafka "$@"
