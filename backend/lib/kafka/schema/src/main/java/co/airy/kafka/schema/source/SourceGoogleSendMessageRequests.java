package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceGoogle;

public class SourceGoogleSendMessageRequests extends SourceGoogle {

    @Override
    public String dataset() {
        return "send-message-requests";
    }
}
