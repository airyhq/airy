package co.airy.mapping.sources.twilio;

import co.airy.mapping.SourceMapper;
import co.airy.mapping.model.Audio;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.Text;
import co.airy.mapping.model.Video;
import org.springframework.stereotype.Component;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.util.stream.Collectors.toMap;

@Component
public class TwilioMapper implements SourceMapper {

    @Override
    public List<String> getIdentifiers() {
        return List.of("twilio.sms", "twilio.whatsapp");
    }

    @Override
    public List<Content> render(String payload) {
        Map<String, String> decodedPayload = parseUrlEncoded(payload);
        List<Content> contents = new ArrayList<>();

        final String mediaUrl = decodedPayload.get("MediaUrl");

        if (mediaUrl != null && !mediaUrl.isBlank()) {
            if(isImage(mediaUrl)) {
                contents.add(new Text(decodedPayload.get("Body")));
                contents.add(new Image(mediaUrl));
            } else if(isVideo(mediaUrl)) {
                contents.add(new Video(mediaUrl));
            } else {
                contents.add(new Audio(mediaUrl));
            }
        } else {
            contents.add(new Text(decodedPayload.get("Body")));
        }

        return contents;
    }

    private boolean isImage(String mediaUrl) {
        final String[] mediaUrlParts = mediaUrl.split("\\.");
        final String mediaExtension = mediaUrlParts[mediaUrlParts.length - 1];
        if (mediaExtension.equalsIgnoreCase("jpg") || mediaExtension.equalsIgnoreCase("jpeg") || mediaExtension.equalsIgnoreCase("png")) {
            return true;
        }
        return false;
    }

    private boolean isVideo(String mediaUrl) {
        final String[] mediaUrlParts = mediaUrl.split("\\.");
        final String mediaExtension = mediaUrlParts[mediaUrlParts.length - 1];
        return mediaExtension.equalsIgnoreCase("mp4");
    }

    private static Map<String, String> parseUrlEncoded(String payload) {
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
