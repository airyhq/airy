package co.airy.kafka.schema.application;

import co.airy.kafka.schema.ApplicationCommunication;

public class ApplicationCommunicationChannels extends ApplicationCommunication {

    @Override
    public String dataset() {
        return "channels";
    }

}
