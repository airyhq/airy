package co.airy.mapping.sources.facebook;

import co.airy.mapping.SourceMapper;
import co.airy.mapping.model.Audio;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.File;
import co.airy.mapping.model.Image;
import co.airy.mapping.model.SourceTemplate;
import co.airy.mapping.model.Text;
import co.airy.mapping.model.Video;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class FacebookMapper implements SourceMapper {

    private final ObjectMapper objectMapper;

    public FacebookMapper() {
        this.objectMapper = new ObjectMapper();
    }

    private final Map<String, Function<String, Content>> mediaContentFactory = Map.of(
            "image", Image::new,
            "video", Video::new,
            "audio", Audio::new,
            "file", File::new
    );

    @Override
    public List<String> getIdentifiers() {
        return List.of("facebook");
    }

    @Override
    public List<Content> render(String payload) throws Exception {
        final JsonNode jsonNode = objectMapper.readTree(payload);
        final JsonNode messageNode = jsonNode.get("message");

        List<Content> contents = new ArrayList<>();

        if (messageNode.get("text") != null) {
            contents.add(new Text(messageNode.get("text").textValue()));
        }

        if (messageNode.get("attachments") != null) {
            messageNode.get("attachments")
                    .elements()
                    .forEachRemaining(attachmentNode -> {
                        final String attachmentType = attachmentNode.get("type").textValue();

                        if (attachmentType.equals("template")) {
                            contents.add(new SourceTemplate(attachmentNode.get("payload").toString()));
                            return;
                        }

                        final String url = attachmentNode.get("payload").get("url").textValue();

                        final Content mediaContent = mediaContentFactory.get(attachmentType).apply(url);
                        contents.add(mediaContent);
                    });
        }

        return contents;
    }
}
