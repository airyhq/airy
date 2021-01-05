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
import java.util.function.BiFunction;

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
            final String[] mediaUrlParts = mediaUrl.split("\\.");
            final String mediaExtension = mediaUrlParts[mediaUrlParts.length - 1].toLowerCase();
            final BiFunction<String, String, List<Content>> processMediaFunction = getMediaFunction(mediaExtension);
            contents = processMediaFunction.apply(mediaUrl, decodedPayload.get("Body"));
        } else {
            contents.add(new Text(decodedPayload.get("Body")));
        }

        return contents;
    }

    private BiFunction<String, String, List<Content>> getMediaFunction(final String extension) {
        BiFunction<String, String, List<Content>> processImageFun = (mediaUrl, body) -> List.of(new Text(body), new Image(mediaUrl));
        BiFunction<String, String, List<Content>> processVideoFun = (mediaUrl, body) -> List.of(new Video(mediaUrl));
        BiFunction<String, String, List<Content>> processAudioFun = (mediaUrl, body) -> List.of(new Audio(mediaUrl));

        final Map<String, BiFunction<String, String, List<Content>>> map = Map.of(
                "jpg", processImageFun,
                "jpeg", processImageFun,
                "png", processImageFun,
                "mp4", processVideoFun,
                "mp3", processAudioFun,
                "ogg", processAudioFun,
                "amr", processAudioFun
        );

        return map.get(extension);
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
