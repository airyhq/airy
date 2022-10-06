package co.airy.core.admin.payload;

import co.airy.model.template.TemplatePayload;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplatesResponsePayload {
    private List<TemplatePayload> data;
}
