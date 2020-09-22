package co.airy.kafka.schema.source;

import co.airy.kafka.schema.SourceFacebook;

public class SourceFacebookAvailableChannelsRequests extends SourceFacebook {

    @Override
    public String dataset() {
        return "available-channels-requests";
    }
}

