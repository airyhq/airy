package co.airy.core.sources.twilio;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.stream.Collectors.toMap;


public class TwilioInfoExtractor {

    static TwilioEventInfo extract(String payload) {
        Map<String, String> twilioContent = parseUrlEncoded(payload);

        return TwilioEventInfo.builder()
                .to(twilioContent.get("To"))
                .from(twilioContent.get("From"))
                .payload(payload)
                .build();
    }

    static Map<String, String> parseUrlEncoded(String payload) {
        List<String> kvPairs = Arrays.asList(payload.split("&"));

        return kvPairs.stream()
                .map((kvPair) -> {
                    String[] fields = kvPair.split("=");

                    if (fields.length != 2) {
                        return null;
                    }

                    String name = URLDecoder.decode(fields[0], StandardCharsets.UTF_8);
                    String value = URLDecoder.decode(fields[1], StandardCharsets.UTF_8);

                    return List.of(name, value);
                })
                .filter(Objects::nonNull)
                .collect(toMap((tuple) -> tuple.get(0), (tuple) -> tuple.get(1)));
    }
}
