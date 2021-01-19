package co.airy.url;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

public class UrlUtil {
    public static Map<String, String> parseUrlEncoded(String payload) {
        List<String> kvPairs = Arrays.asList(payload.split("&"));

        return kvPairs.stream()
                .map((kvPair) -> {
                    String[] fields = kvPair.split("=");

                    String name = URLDecoder.decode(fields[0], StandardCharsets.UTF_8);
                    String value = "";
                    if (fields.length > 1) {
                        value = URLDecoder.decode(fields[1], StandardCharsets.UTF_8);
                    }

                    return List.of(name, value);
                })
                .collect(toMap((tuple) -> tuple.get(0), (tuple) -> tuple.get(1)));
    }
}
