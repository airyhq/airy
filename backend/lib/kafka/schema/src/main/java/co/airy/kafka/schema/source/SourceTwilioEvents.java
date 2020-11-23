package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceTwilio;

public class SourceTwilioEvents extends SourceTwilio {
    @Override
    public String dataset() {
        return "events";
    }
}
