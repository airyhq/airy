package co.airy.kafka.schema;

import java.util.Map;

public abstract class AbstractTopic implements Topic {
    @Override
    public String name() { return namespace() + String.format("%s.%s.%s", kind(), domain(), dataset()); }

    @Override
    public Map<String, String> config() {
        return Map.of();
    }

    private String namespace() {
        String namespace = System.getenv("AIRY_CORE_NAMESPACE");
        return namespace == null ? "" : namespace + ".";
    }
}
