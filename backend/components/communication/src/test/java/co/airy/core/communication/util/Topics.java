package co.airy.core.communication.util;

import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.schema.application.ApplicationCommunicationUsers;

public class Topics {
    public static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    public static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    public static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    public static final ApplicationCommunicationReadReceipts applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts();
    public static final ApplicationCommunicationUsers applicationCommunicationUsers = new ApplicationCommunicationUsers();

    public static Topic[] getTopics() {
        return new Topic[]{applicationCommunicationMessages, applicationCommunicationChannels, applicationCommunicationMetadata, applicationCommunicationReadReceipts, applicationCommunicationUsers};
    }
}
