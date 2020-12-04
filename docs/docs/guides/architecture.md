---
title: Architecture of the Airy Core Plaform
sidebar_label: Architecture
---

## Overview

The Airy Core Platform is a messaging platform comprised of a backend and frontend system.

The `backend` system is a streaming platform and its role is to:

- Ingest conversational events from different sources (mostly via webhook
  integrations), process them and store them in an Apache Kafka cluster
- Once processed, the events are available and accessible through an [API](api/http.md)
- Expose conversational events via a [webhook](api/webhook.md) integration
- Manage authentication and authorization features

The `frontend` system is comprised of a demo application and the JavaScript integration of the [Chat Plugin](sources/chat-plugin.md).

Having that in mind, these are the docker containers or the `Airy apps` which run as part of the Airy Core Platform:

## Sources

- sources-`SOURCE_NAME`-webhook - Ingest events from the `SOURCE_NAME` source
- sources-`SOURCE_NAME`-events-router - Process messages from a `SOURCE_NAME` source
- sources-`SOURCE_NAME`-sender - Send events (mostly messages) to a `SOURCE_NAME` source

## API

- api-admin - Backend services for administration of messaging sources and destinations
- api-auth - Backend services for authentication and authorization
- api-communication - Backend services which expose conversations and messages

## Webhook

- webhook-publisher - Process conversational data and write in Redis the events to be exposed to external parties.
- webhook-consumer - Read from Redis and send events to external webhooks

## Frontend

- frontend-demo - Web application for viewing messages
- frontend-chat-plugin - Web chat plugin
