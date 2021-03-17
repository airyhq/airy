package co.airy.model.template;

import co.airy.avro.communication.Template;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplatePayload {
    private String id;
    private String name;
    private String source;
    private JsonNode content;

    private static final ObjectMapper mapper = new ObjectMapper();

    public static TemplatePayload fromTemplate(final Template template) {
        JsonNode content;
        try {
            content = mapper.readTree(template.getContent());
        } catch (JsonProcessingException e) {
            content = JsonNodeFactory.instance.objectNode();
        }
        return TemplatePayload.builder()
                .id(template.getId())
                .name(template.getName())
                .content(content)
                .source(template.getSource())
                .build();
    }
}
