package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceTwilio;

public class SourceTwilioSendMessageRequests extends SourceTwilio {

    @Override
    public String dataset() {
        return "send-message-requests";
    }
}
