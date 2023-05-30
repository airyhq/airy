---
title: Streams
sidebar_label: Streams
---

Refer to our [stream](getting-started/glossary.md#stream) definition
for more information.

## List

`POST /streams.list`

The  list of created streams is returned.

**Sample response**

```json5
[
  {
    "name": "customapp",
    "topic": "customapp"
  },
  {
    "name": "events",
    "topic": "events"
  }
]
```

At the moment the name of the output topic is the same as the name of the stream itself.

## Create

`POST /streams.create`

**Sample request**

```json5
{
    "name": "customapp",
    "topics": [{
            "name": "messages",
            "fields": [{
                    "name": "source",
                    "newName": "from"
                },
                {
                    "name": "senderId",
                    "nawName": "sender"
                }
            ]
        },
        {
            "name": "channels",
            "fields": [{
                    "name": "connectionState",
                    "newName": "state"
                }
            ]
        }
    ],
    "joins": [{
        "name": "newSource",
        "field1": "source",
        "field2": "source"
    }],
    "aggregations": [],
    "key": "messages.source"
}
```

The name of the created stream is returned, alongside with the output topic.

**Sample response**

```json5
{
    "name":"customapp",
    "outputTopic":"customapp"
}
```

## Info

`POST /streams.info`

**Sample request**

```json5
{
  "name": "customapp"
}
```

Information about the stream is returned.

**Sample response**

```json5
{
	"stream": {
		"name": "CUSTOMAPP",
		"writeQueries": [{
			"queryString": "CREATE STREAM CUSTOMAPP WITH (KAFKA_TOPIC='CUSTOMAPP', PARTITIONS=10, REPLICAS=1) AS SELECT\n  A.SOURCE A_SOURCE,\n  A.SENDERID SENDERID,\n  B.CONNECTIONSTATE CONNECTIONSTATE\nFROM MESSAGES A\nINNER JOIN CHANNELS B WITHIN 365 DAYS ON ((B.SOURCE = A.SOURCE))\nEMIT CHANGES;",
			"sinks": [
				"CUSTOMAPP"
			],
			"sinkKafkaTopics": [
				"CUSTOMAPP"
			],
			"id": "CSAS_CUSTOMAPP_79",
			"statusCount": {
				"RUNNING": 1
			},
			"queryType": "PERSISTENT",
			"state": "RUNNING"
		}],
		"fields": [{
				"name": "A_SOURCE",
				"schema": {
					"type": "STRING"
				},
				"type": "KEY"
			},
			{
				"name": "SENDERID",
				"schema": {
					"type": "STRING"
				}
			},
			{
				"name": "CONNECTIONSTATE",
				"schema": {
					"type": "STRING"
				}
			}
		],
		"type": "STREAM",
		"keyFormat": "KAFKA",
		"valueFormat": "AVRO",
		"topic": "CUSTOMAPP",
		"partitions": 10,
		"replication": 1,
		"statement": "CREATE STREAM CUSTOMAPP WITH (KAFKA_TOPIC='CUSTOMAPP', PARTITIONS=10, REPLICAS=1) AS SELECT\n  A.SOURCE A_SOURCE,\n  A.SENDERID SENDERID,\n  B.CONNECTIONSTATE CONNECTIONSTATE\nFROM MESSAGES A\nINNER JOIN CHANNELS B WITHIN 365 DAYS ON ((B.SOURCE = A.SOURCE))\nEMIT CHANGES;"
	}
}
```

## Delete

`POST /streams.delete`

**Sample request**

```json5
{
  "name": "customapp"
}
```

The name of the deleted stream is returned.

**Sample response**

```json5
{
  "name": "customapp"
}
```
