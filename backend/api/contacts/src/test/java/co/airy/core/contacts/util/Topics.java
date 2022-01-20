package co.airy.core.contacts.util;

import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationContacts;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;

public class Topics {
    public static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    public static final ApplicationCommunicationContacts applicationCommunicationContacts = new ApplicationCommunicationContacts();
    public static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();

    public static Topic[] getTopics() {
        return new Topic[]{applicationCommunicationMessages, applicationCommunicationContacts, applicationCommunicationMetadata};
    }
}
