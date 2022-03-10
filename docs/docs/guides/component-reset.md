---
title: Resetting an Airy Kafka streaming app
sidebar_label: Reset Airy component
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";

<TLDR>
How to reset an Airy component.
</TLDR>

The `Airy Core` components are Kafka streaming apps which consume and produce to Kafka. Each of them has its own consumer group that can be reset, to re-read all the events and messages from the beginning or from a certain offset.

## Consumer group information

Information about the Kafka consumer groups used by `Airy Core` can be printed out with the following command:

```sh
kubectl exec -it kafka-0 -- kafka-consumer-groups.sh --bootstrap-server kafka-headless:9092 --list
```

To retrieve information about the particular consumer group run:

```sh
kubectl exec -it kafka-0 -- kafka-consumer-groups.sh --bootstrap-server kafka-headless:9092 --describe --group $CONSUMER_GROUP | grep -v TOPIC | grep -v "Consumer group" | awk '{ print $2; }' | sort | uniq | grep -v repartition | grep -v KTABLE | tr "\n" "," | sed 's/,$/\n/g' | sed 's/^,//g'
```

## Reset the Kafka streaming app

Once you have the information about the consumer group, you can proceed with reset the kafka-streaming app.

First scale down the particular component:

```sh
kubectl scale deployment $DEPLOYMENT --replicas=0
```

Then reset the Kafka streaming app:

```sh
kubectl exec -it kafka-0 -- kafka-streams-application-reset.sh --bootstrap-servers kafka-headless:9092  --application-id $CONSUMER_GROUPS  --to-earliest --input-topics $INPUT_TOPICS
```

Then scale the app back up:

```sh
kubectl scale deployment $DEPLOYMENT --replicas=1
```

## Example

For example, to reset the `api-communication` streaming app, run the following commands:

```sh
export DEPLOYMENT="api-communication"
```

```sh
kubectl scale deployment $DEPLOYMENT --replicas=0
```

```sh
export CONSUMER_GROUP="api.CommunicationStores"
```

```sh
INPUT_TOPICS=$(kubectl exec -it kafka-0 -- kafka-consumer-groups.sh --bootstrap-server kafka-headless:9092 --describe --group $CONSUMER_GROUP | grep -v TOPIC | grep -v "Consumer group" | awk '{ print $2; }' | sort | uniq | grep -v repartition | grep -v KTABLE | tr "\n" "," | sed 's/,$/\n/g' | sed 's/^,//g')
```

```sh
kubectl exec -it kafka-0 -- kafka-streams-application-reset.sh --bootstrap-servers kafka-headless:9092  --application-id $CONSUMER_GROUP  --to-earliest --input-topics $INPUT_TOPICS
```

```sh
kubectl scale deployment $DEPLOYMENT --replicas=1
```
