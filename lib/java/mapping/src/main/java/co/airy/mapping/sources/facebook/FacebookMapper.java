package co.airy.mapping.sources.facebook;

import co.airy.mapping.SourceMapper;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.Text;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class FacebookMapper implements SourceMapper {

    private final ObjectMapper objectMapper;

    public FacebookMapper() {
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<String> getIdentifiers() {
        return List.of("facebook");
    }

    @Override
    public List<Content> render(String payload) throws Exception {
        final JsonNode jsonNode = objectMapper.readTree(payload);
        final JsonNode messageNode = jsonNode.get("message");

        List<Content> contents = new ArrayList<>();

        if(messageNode.get("text") != null) {
            contents.add(new Text(messageNode.get("text").textValue()));
        }

        if (messageNode.get("attachments") != null) {
            messageNode.get("attachments")
                    .elements()
                    .forEachRemaining(attachmentNode -> {
                        if ("image".equalsIgnoreCase(attachmentNode.get("type").textValue())) {
                            contents.add(new Image(attachmentNode.get("payload").get("url").textValue()));
                        }
                    });
        }

        return contents;
    }
}
