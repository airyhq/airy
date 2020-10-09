resource "kafka_topic" "activity_message_push-v2" {
   name               = "activity_message_push-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"retention.ms" = "1800000"
   }
 }

resource "kafka_topic" "activity_message_upsert-v2" {
   name               = "activity_message_upsert-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"retention.ms" = "1800000"
   }
 }

resource "kafka_topic" "application_communication_available-channels" {
   name               = "application_communication_available-channels"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_communication_badge-unread-count-v1" {
   name               = "application_communication_badge-unread-count-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_communication_channels" {
   name               = "application_communication_channels"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_communication_contacts-v2" {
   name               = "application_communication_contacts-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_communication_content-log" {
   name               = "application_communication_content-log"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_communication_conversation-states-v1" {
   name               = "application_communication_conversation-states-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_communication_conversation-unread-count-v1" {
   name               = "application_communication_conversation-unread-count-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_communication_conversations-read-states-v1" {
   name               = "application_communication_conversations-read-states-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_communication_conversations-v2" {
   name               = "application_communication_conversations-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_communication_message-containers-v1" {
   name               = "application_communication_message-containers-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_communication_message-content-v1" {
   name               = "application_communication_message-content-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_communication_messages-read-states-v1" {
   name               = "application_communication_messages-read-states-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_contacts_info-v1" {
   name               = "application_contacts_info-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_contacts_tags-v1" {
   name               = "application_contacts_tags-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_identity_memberships" {
   name               = "application_identity_memberships"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
   }
 }

resource "kafka_topic" "application_identity_organizations" {
   name               = "application_identity_organizations"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
   }
 }

resource "kafka_topic" "application_identity_settings" {
   name               = "application_identity_settings"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_identity_users" {
   name               = "application_identity_users"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
   }
 }

resource "kafka_topic" "application_organization_signups" {
   name               = "application_organization_signups"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_organization_tags" {
   name               = "application_organization_tags"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_organization_team-members" {
   name               = "application_organization_team-members"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "application_organization_teams" {
   name               = "application_organization_teams"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_organization_templates" {
   name               = "application_organization_templates"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "application_organization_webhooks" {
   name               = "application_organization_webhooks"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "etl_communication_conversation-view-v1" {
   name               = "etl_communication_conversation-view-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "etl_communication_message-view-v1" {
   name               = "etl_communication_message-view-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact"
	"min.compaction.lag.ms" = "86400000"
	"segment.bytes" = "10485760"
   }
 }

resource "kafka_topic" "failed_application_organization_templates" {
   name               = "failed_application_organization_templates"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "failed_source_facebook_events" {
   name               = "failed_source_facebook_events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "failed_source_facebook_new-contacts-v2" {
   name               = "failed_source_facebook_new-contacts-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "internal_organization_tags_delete" {
   name               = "internal_organization_tags_delete"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"cleanup.policy" = "compact,delete"
	"retention.bytes" = "1000000000"
	"retention.ms" = "3600000"
   }
 }

resource "kafka_topic" "migration_tests_message" {
   name               = "migration_tests_message"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "ops_application_health" {
   name               = "ops_application_health"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"retention.ms" = "3600000"
   }
 }

resource "kafka_topic" "ops_application_logs" {
   name               = "ops_application_logs"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
	"retention.ms" = "7889400000"
   }
 }

resource "kafka_topic" "source_facebook_ad-referrals" {
   name               = "source_facebook_ad-referrals"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_attachment-resolve-requests" {
   name               = "source_facebook_attachment-resolve-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_attachments" {
   name               = "source_facebook_attachments"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_available-channels-requests" {
   name               = "source_facebook_available-channels-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_connect-channel-requests" {
   name               = "source_facebook_connect-channel-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_events" {
   name               = "source_facebook_events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_new-contacts-v2" {
   name               = "source_facebook_new-contacts-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_send-message-requests-v2" {
   name               = "source_facebook_send-message-requests-v2"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_send-message-requests-v3" {
   name               = "source_facebook_send-message-requests-v3"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_facebook_transformed-events" {
   name               = "source_facebook_transformed-events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_available-channels-requests" {
   name               = "source_google_available-channels-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_connect-channel-requests" {
   name               = "source_google_connect-channel-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_events" {
   name               = "source_google_events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_place-resolve-requests" {
   name               = "source_google_place-resolve-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_resolved-places" {
   name               = "source_google_resolved-places"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_send-message-requests" {
   name               = "source_google_send-message-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_send-message-requests-v1" {
   name               = "source_google_send-message-requests-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_surveys" {
   name               = "source_google_surveys"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_google_transformed-events" {
   name               = "source_google_transformed-events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_organizations_db_memberships" {
   name               = "source_organizations_db_memberships"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_organizations_db_organizations" {
   name               = "source_organizations_db_organizations"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_organizations_db_templates" {
   name               = "source_organizations_db_templates"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_organizations_db_users" {
   name               = "source_organizations_db_users"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_twilio_available-channels-requests" {
   name               = "source_twilio_available-channels-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_twilio_connect-channel-requests" {
   name               = "source_twilio_connect-channel-requests"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_twilio_events" {
   name               = "source_twilio_events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_twilio_send-message-requests-v1" {
   name               = "source_twilio_send-message-requests-v1"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

resource "kafka_topic" "source_twilio_transformed-events" {
   name               = "source_twilio_transformed-events"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {

   }
 }

