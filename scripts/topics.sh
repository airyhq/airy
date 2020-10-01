#!/bin/bash

# topics.sh

# Used from the create-topics.sh script, holds registry of all Kafka topics in
# our system

IFS=$'\n\t'

sourceTopics=(
    "source.facebook.events"
    "source.facebook.transformed-events"
)

communicationTopics=(
    "application.communication.metadata"
    "application.communication.channels"
    "application.communication.messages"
)

opsTopicsShortLived=(
    "ops.application.health"
)
