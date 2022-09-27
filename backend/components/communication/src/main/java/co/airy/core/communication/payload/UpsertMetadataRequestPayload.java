package co.airy.core.communication.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpsertMetadataRequestPayload {
    @NotNull
    @Pattern(regexp = "message|conversation|channel", message = "Must be one of message, conversation or channel")
    private String subject;

    @NotNull
    private String id;

    @NotNull
    @Valid
    private JsonNode data;
}
