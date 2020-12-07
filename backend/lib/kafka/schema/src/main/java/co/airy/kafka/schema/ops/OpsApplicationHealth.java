package co.airy.kafka.schema.ops;

import co.airy.kafka.schema.OpsApplication;

import java.util.Map;

public class OpsApplicationHealth extends OpsApplication {

    @Override
    public String dataset() {
        return "health";
    }

    @Override
    public Map<String, String> config() { return Map.of("retention.ms", "3600000");} // 1 hour
}
