package co.airy.core.sources.twilio;

import java.util.Map;

import static co.airy.url.UrlUtil.parseUrlEncoded;

public class TwilioInfoExtractor {

    static TwilioEventInfo extract(String payload) {
        Map<String, String> twilioContent = parseUrlEncoded(payload);

        return TwilioEventInfo.builder()
                .to(twilioContent.get("To"))
                .from(twilioContent.get("From"))
                .payload(payload)
                .build();
    }
}
