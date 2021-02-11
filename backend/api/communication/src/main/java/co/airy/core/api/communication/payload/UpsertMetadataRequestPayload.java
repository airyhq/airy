package co.airy.core.api.communication.payload;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpsertMetadataRequestPayload {
    @NotNull
    private String subject;

    @NotNull
    private String id;

    @NotNull
    @Valid
    private JsonNode data;
}
