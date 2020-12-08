package co.airy.kafka.schema;

public abstract class SourceTwilio extends AbstractTopic {
    @Override
    public String kind() {
        return "source";
    }

    @Override
    public String domain() {
        return "twilio";
    }
}
