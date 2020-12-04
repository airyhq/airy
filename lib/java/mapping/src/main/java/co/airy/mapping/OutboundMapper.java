package co.airy.mapping;

import co.airy.mapping.model.Content;
import co.airy.mapping.model.Text;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class OutboundMapper {

    private final ObjectMapper objectMapper;

    public OutboundMapper() {
        this.objectMapper = new ObjectMapper();
    }

    public Content render(String payload) throws Exception {
        final JsonNode jsonNode = objectMapper.readTree(payload);
        return new Text(jsonNode.get("text").textValue());
    }
}
