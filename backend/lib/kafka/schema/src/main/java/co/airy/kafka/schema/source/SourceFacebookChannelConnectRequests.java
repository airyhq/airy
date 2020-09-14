package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceFacebook;

public class SourceFacebookChannelConnectRequests extends SourceFacebook {

    @Override
    public String dataset() {
        return "connect-channel-requests";
    }

}

