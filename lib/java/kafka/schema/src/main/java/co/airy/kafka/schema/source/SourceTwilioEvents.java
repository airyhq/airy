package co.airy.kafka.schema.source;

import co.airy.kafka.schema.AbstractTopic;

public class SourceTwilioEvents extends AbstractTopic {
    @Override
    public String kind() {
        return "source";
    }
    @Override
    public String domain() {
        return "twilio";
    }
    @Override
    public String dataset() {
        return "events";
    }
}
