#!/bin/bash

# topics.sh

# Used from the create-topics.sh script, holds registry of all Kafka topics in
# our system

IFS=$'\n\t'

sourceTopics=(
    "source.facebook.events"
    "source.facebook.new-contacts-v2"
    "source.facebook.connect-channel-requests"
    "source.facebook.available-channels-requests"

    "source.facebook.transformed-events"
    "source.facebook.send-message-requests-v3"
    "source.facebook.attachment-resolve-requests"
    "source.facebook.attachments"
    "source.facebook.ad-referrals"

    "source.google.transformed-events"

    "source.google.send-message-requests-v1"
    "source.google.connect-channel-requests"
    "source.google.available-channels-requests"
    "source.google.place-resolve-requests"
    "source.google.events"
    "source.google.surveys"


    "source.twilio.events"
    "source.twilio.transformed-events"
    "source.twilio.connect-channel-requests"
    "source.twilio.available-channels-requests"
    "source.twilio.send-message-requests-v1"

    "source.organizations_db.organizations"
    "source.organizations_db.memberships"
    "source.organizations_db.users"
    "source.organizations_db.templates"
)

sourceTopicsCompacted=(
  "source.google.resolved-places"
)

failedTopics=(
    "failed.source.google.append-message-to-conversations"

    "failed.source.facebook.new-contacts-v2"
    "failed.source.facebook.events"

    "failed.conversations-unread-message-counter-v2.no-conversation"
    "failed.etl.message-view-creator.no-conversation"
    "failed.etl.conversation-view-creator.no-channel"
)

internalTopics=(
    "internal.organization.tags.delete"

    "internal.conversations-unread-message-counter-v2.no-conversation"
)

communicationTopics=(
    "application.communication.message-content-v1"
    "application.communication.message-containers-v1"
    "application.communication.available-channels"
)

migrationTopics=(
    "migration.tests.message"
)

communicationTopicsCompacted=(
    "application.communication.conversations-read-states-v1"
    "application.communication.channels"

    "application.communication.conversation-states-v1"
    "application.communication.conversations-v2"
    "application.communication.contacts-v2"
    "application.communication.badge-unread-count-v1"
    "application.communication.conversation-unread-count-v1"
    "application.communication.content-log"
)

organizationTopics=(
    "application.organization.signups"
    "application.organization.webhooks"
    "application.organization.team-members"
)

organizationTopicsCompacted=(
    "application.organization.tags"
    "application.organization.templates"
    "application.organization.teams"
)

identityTopics=(
    "application.identity.memberships"
    "application.identity.organizations"
)

identityTopicsCompacted=(
    "application.identity.settings"
    "application.identity.users"
)

activityTopics=(
    "activity.message.upsert-v2"
)

sinkTopics=(
    "sink.contacts.public.contact_tags"
    "sink.org_flipper_source.public.users"
)

contactTopics=(
    "application.contacts.info-v1"
)

contactTopicsCompacted=(
    "application.contacts.tags-v1"
)

etlTopicsCompacted=(
    "etl.communication.message-view-v1"
    "etl.communication.conversation-view-v1"
)

opsTopicsWithRetention=(
    "ops.application.logs"
)

opsTopicsShortLived=(
    "ops.application.health"
)
