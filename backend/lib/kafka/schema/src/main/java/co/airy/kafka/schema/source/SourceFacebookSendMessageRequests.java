package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceFacebook;

public class SourceFacebookSendMessageRequests extends SourceFacebook {

    @Override
    public String dataset() {
        return "send-message-requests";
    }
}
