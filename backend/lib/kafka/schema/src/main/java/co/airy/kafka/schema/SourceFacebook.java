package co.airy.kafka.schema;

public abstract class SourceFacebook extends AbstractTopic {
    @Override
    public String kind() {
        return "source";
    }

    @Override
    public String domain() {
        return "facebook";
    }
}
