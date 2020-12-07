package co.airy.kafka.schema;

import java.util.Map;

public abstract class AbstractTopic implements Topic {
    @Override
    public String name() {
        return testNamespace() + String.format("%s.%s.%s", kind(), domain(), dataset());
    }

    @Override
    public Map<String, String> config() {
        return Map.of();
    }

    private String testNamespace() {
        String testTarget = System.getenv("TEST_TARGET");
        if (testTarget == null || "".equals(testTarget)) {
            return "";
        }

        return testTarget.split(":")[1]; // take the name of the test as a namespace
    }
}
