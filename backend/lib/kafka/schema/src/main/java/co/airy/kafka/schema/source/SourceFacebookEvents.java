package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceFacebook;

public class SourceFacebookEvents extends SourceFacebook {
    @Override
    public String dataset() {
        return "events";
    }
}
