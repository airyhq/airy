---
title: Airy Core architecture
sidebar_label: Architecture
---

## Overview

Airy Core is a messaging platform that contains a backend and frontend system.

The `backend` system is a streaming platform. Its role is to:

- Ingest conversational events from different sources (mostly via webhook
  integrations), process them, and store them in an Apache Kafka cluster.
- Make the processed events available and accessible through the [Core API](/api/introduction).
- Expose conversational events via a [webhook](/api/webhook) integration.
- Manage authentication and authorization features.

The `frontend` system contains a demo application and the JavaScript integration
of the [Chat Plugin](sources/chatplugin/overview.md).

Having that in mind, these are the docker containers – or the `Airy Components` –
which run as part of Airy Core:

## Sensitive data

### Application data

All the application data is stored in the `Kafka` cluster and the topics which are created for the components. As the Kafka cluster is backed up by persistent EBS storage, the data is stored on the PersistentVolumes defined in the Kubernetes cluster. At the moment, the data in the Kafka topics is not encrypted.

### Configuration data

All the credentials, keys and secrets which the user can overwrite can be configured in the `airy.yaml` file. When running `airy create` or `airy config apply` these values are mapped into the following ConfigMaps inside the kafka cluster:

- `security` ConfigMap - holding the necessary security parameters.
- `{component-type}-{component}` ConfigMap - holding the configuration for individual sources and components
- `airy-config-map` ConfigMap - storing a copy of the `airy.yaml` config file, inside the Kubernetes cluster.

## Sources

- sources-`SOURCE_NAME`-webhook - Ingest events from the `SOURCE_NAME` source
- sources-`SOURCE_NAME`-events-router - Process messages from a `SOURCE_NAME` source
- sources-`SOURCE_NAME`-connector - Send and receive events (mostly messages) to and from a `SOURCE_NAME` source and extract metadata

## API

- api-admin - Backend services for administration of messaging sources and destinations
- api-communication - Backend services which expose conversations and messages

## Webhook

- webhook-publisher - Processes conversational data and write in Redis the events
  to be exposed to external parties
- webhook-consumer - Reads from Redis and send events to external webhooks

## Frontend

- frontend-ui - Web application for viewing messages
- frontend-chat-plugin - Web chat plugin

## Airy Controller

Airy Core ships with a Kubernetes controller, which is responsible for starting
and reloading the appropriate `Airy Components` based on the provided configuration. The controller is a deployment named `airy-controller`.

## Airy CLI

Every release features a command line binary, used to configure and fetch status
information from your Airy Core instance. This tool is referred to as the [Airy
CLI](/cli/introduction.md) throughout the documentation.
