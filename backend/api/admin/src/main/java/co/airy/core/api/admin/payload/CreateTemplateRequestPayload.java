package co.airy.core.api.admin.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTemplateRequestPayload {
    @NotNull
    private String name;
    @NotNull
    private String content;
    @Valid
    @NotNull
    private JsonNode variables;
}
