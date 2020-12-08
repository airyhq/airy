package co.airy.kafka.schema.application;

import co.airy.kafka.schema.ApplicationCommunication;

public class ApplicationCommunicationWebhooks extends ApplicationCommunication {
    @Override
    public String dataset() {
        return "webhooks";
    }
}
