package co.airy.kafka.schema.ops;

import co.airy.kafka.schema.OpsApplication;

public class OpsApplicationLogs extends OpsApplication {
    @Override
    public String dataset() {
        return "logs";
    }
}
