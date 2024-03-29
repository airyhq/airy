package co.airy.kafka.schema.application;

import co.airy.kafka.schema.ApplicationCommunication;

import java.util.Map;

public class ApplicationCommunicationWebhooks extends ApplicationCommunication {
    @Override
    public String dataset() {
        return "webhooks-v0.29.0";
    }

    @Override
    public Map<String, String> config() {
        return Map.of("cleanup.policy", "compact", "segment.bytes", "10485760", "min.compaction.lag.ms", "86400000");
    }
}
