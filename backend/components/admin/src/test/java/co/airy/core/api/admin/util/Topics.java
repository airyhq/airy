package co.airy.core.api.admin.util;

import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationTags;
import co.airy.kafka.schema.application.ApplicationCommunicationTemplates;
import co.airy.kafka.schema.application.ApplicationCommunicationUsers;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.schema.ops.OpsApplicationLogs;

public class Topics {
    public static final Topic applicationCommunicationChannels = new ApplicationCommunicationChannels();
    public static final Topic applicationCommunicationWebhooks = new ApplicationCommunicationWebhooks();
    public static final Topic applicationCommunicationTags = new ApplicationCommunicationTags();
    public static final Topic applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    public static final Topic applicationCommunicationTemplates = new ApplicationCommunicationTemplates();
    public static final Topic applicationCommunicationUsers = new ApplicationCommunicationUsers();
    public static final Topic opsApplicationLogs = new OpsApplicationLogs();

    public static Topic[] getTopics() {
        return new Topic[]{applicationCommunicationChannels,
                applicationCommunicationWebhooks,
                applicationCommunicationTags,
                applicationCommunicationMetadata,
                applicationCommunicationTemplates,
                applicationCommunicationUsers,
                opsApplicationLogs};
    }
}
