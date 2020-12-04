package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceGoogle;

public class SourceGoogleEvents extends SourceGoogle {
    @Override
    public String dataset() {
        return "events";
    }
}
