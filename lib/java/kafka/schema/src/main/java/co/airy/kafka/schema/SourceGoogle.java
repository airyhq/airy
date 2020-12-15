package co.airy.kafka.schema;

public abstract class SourceGoogle extends AbstractTopic {
    @Override
    public String kind() {
        return "source";
    }

    @Override
    public String domain() {
        return "google";
    }
}
