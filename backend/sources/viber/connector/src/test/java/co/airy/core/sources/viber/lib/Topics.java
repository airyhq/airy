package co.airy.core.sources.viber.lib;

import co.airy.kafka.schema.Topic;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.source.SourceViberEvents;

public class Topics {
    public static final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();
    public static final ApplicationCommunicationChannels applicationCommunicationChannels = new ApplicationCommunicationChannels();
    public static final ApplicationCommunicationMetadata applicationCommunicationMetadata = new ApplicationCommunicationMetadata();
    public static final SourceViberEvents sourceViberEvents = new SourceViberEvents();

    public static Topic[] getTopics() {
        return new Topic[]{applicationCommunicationMessages, applicationCommunicationChannels, applicationCommunicationMetadata, sourceViberEvents};
    }
}
