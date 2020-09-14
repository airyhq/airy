package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceFacebook;

public class SourceFacebookTransformedEvents extends SourceFacebook {
    @Override
    public String dataset() {
        return "transformed-events";
    }
}
