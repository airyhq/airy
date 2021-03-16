package co.airy.core.api.admin.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTemplateRequestPayload {
    @NotNull
    private UUID id;
    private String source;
    private String name;
    private JsonNode content;
}
