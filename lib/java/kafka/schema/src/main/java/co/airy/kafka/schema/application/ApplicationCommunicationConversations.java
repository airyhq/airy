package co.airy.kafka.schema.application;

import co.airy.kafka.schema.ApplicationCommunication;

import java.util.Map;

public class ApplicationCommunicationConversations extends ApplicationCommunication {
    @Override
    public String dataset() {
        return "contacts";
    }

    @Override
    public Map<String, String> config() {
        return Map.of("cleanup.policy", "compact", "segment.bytes", "10485760", "min.compaction.lag.ms", "86400000");
    }
}
