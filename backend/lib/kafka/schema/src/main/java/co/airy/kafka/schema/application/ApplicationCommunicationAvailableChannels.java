package co.airy.kafka.schema.application;

import co.airy.kafka.schema.ApplicationCommunication;

public class ApplicationCommunicationAvailableChannels extends ApplicationCommunication {

    @Override
    public String dataset() {
        return "available-channels";
    }

}
