package co.airy.kafka.schema;

public abstract class OpsApplication extends AbstractTopic {
    @Override
    public String kind() {
        return "ops";
    }

    @Override
    public String domain() {
        return "application";
    }
}
