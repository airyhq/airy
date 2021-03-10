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
    private String sourceType;
    private String content;
    private JsonNode variables;
    public static TemplatePayload fromTemplate(final Template template) {
        final ObjectMapper mapper = new ObjectMapper();
        JsonNode variables;
        try {
            variables = mapper.readTree(template.getVariables());
        } catch (JsonProcessingException e) {
            variables = JsonNodeFactory.instance.objectNode();
        }
        return TemplatePayload.builder()
                .id(template.getId())
                .name(template.getName())
                .content(template.getContent())
                .variables(variables)
                .sourceType(template.getSourceType())
                .build();
    }
}
