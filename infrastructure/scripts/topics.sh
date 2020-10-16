#!/bin/bash

# topics.sh

# A registry of all the neccessary topics in kafka.
# Used from the create-topics.sh script

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