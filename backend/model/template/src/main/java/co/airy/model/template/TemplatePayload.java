package co.airy.model.template;

import co.airy.avro.communication.Template;
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
    private String content;

    public static TemplatePayload fromTemplate(final Template template) {
        return TemplatePayload.builder()
                .id(template.getId())
                .name(template.getName())
                .content(template.getContent())
                .build();
    }
}
