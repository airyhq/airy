package co.airy.mapping.sources.google;

import co.airy.mapping.SourceMapper;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.Text;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

@Component
public class GoogleMapper implements SourceMapper {
    private final ObjectMapper objectMapper;

    public GoogleMapper() {
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<String> getIdentifiers() {
        return List.of("google");
    }

    @Override
    public List<Content> render(String payload) throws Exception {
        final JsonNode jsonNode = objectMapper.readTree(payload);
        final JsonNode messageNode = jsonNode.get("message");
        if (messageNode != null) {
            return renderMessage(messageNode);
        }
        final JsonNode suggestionResponseNode = jsonNode.get("suggestionResponse");
        if (suggestionResponseNode != null) {
            return renderSuggestionResponse(suggestionResponseNode);
        }

        throw new Exception("google mapper only supports `message` and `suggestionResponse`");
    }

    private List<Content> renderMessage(JsonNode messageNode) {
        final String messageNodeValue = messageNode.get("text").textValue();
        if (isGoogleStorageUrl(messageNodeValue)) {
            return List.of(new Image(messageNodeValue));
        } else {
            return List.of(new Text(messageNodeValue));
        }
    }

    private List<Content> renderSuggestionResponse(JsonNode suggestionResponseNode) {
        final String textContent = suggestionResponseNode.get("text").textValue();
        return List.of(new Text(textContent));
    }

    private boolean isGoogleStorageUrl(final String url) {
        URI uri;
        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            return false;
        }

        if (!uri.getHost().startsWith("storage.googleapis.com")) {
            return false;
        }

        final Map<String, String> params = List.of(uri.getQuery().split("&"))
                .stream()
                .map(param -> param.split("="))
                .map(l -> Map.of(l[0], l[1]))
                .flatMap(map -> map.entrySet().stream())
                .collect(toMap(
                        m -> m.getKey().toLowerCase(),
                        Map.Entry::getValue,
                        (s1, s2) -> s2));

        return !params.get("x-goog-algorithm").isEmpty()
                && !params.get("x-goog-credential").isEmpty()
                && !params.get("x-goog-date").isEmpty()
                && !params.get("x-goog-expires").isEmpty()
                && !params.get("x-goog-signedheaders").isEmpty()
                && !params.get("x-goog-signature").isEmpty();
    }

}
