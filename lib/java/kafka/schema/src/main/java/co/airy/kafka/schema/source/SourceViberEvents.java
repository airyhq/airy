package co.airy.kafka.schema.source;

import co.airy.kafka.schema.AbstractTopic;

public class SourceViberEvents extends AbstractTopic {
    @Override
    public String kind() {
        return "source";
    }
    @Override
    public String domain() {
        return "viber";
    }
    @Override
    public String dataset() {
        return "events";
    }
}
