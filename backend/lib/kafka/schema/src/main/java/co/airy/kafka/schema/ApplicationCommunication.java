package co.airy.kafka.schema;

public abstract class ApplicationCommunication extends  AbstractTopic {
    @Override
    public String kind() {
        return "application";
    }

    @Override
    public String domain() {
        return "communication";
    }
}
