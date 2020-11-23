package co.airy.mapping.sources.google;

import co.airy.mapping.SourceMapper;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.Text;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;

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
    public Content render(String payload) throws Exception {
        final JsonNode jsonNode = objectMapper.readTree(payload);
        final JsonNode messageNode = jsonNode.get("message");
        return new Text(messageNode.get("text").textValue());
    }
}
