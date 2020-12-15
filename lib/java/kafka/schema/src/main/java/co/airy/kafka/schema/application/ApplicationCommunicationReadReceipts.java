package co.airy.kafka.schema.application;

import co.airy.kafka.schema.ApplicationCommunication;

import java.util.Map;

public class ApplicationCommunicationReadReceipts extends ApplicationCommunication {
    @Override
    public String dataset() {
        return "read-receipt";
    }

    @Override
    public Map<String, String> config() {
        return Map.of();
    }
}
