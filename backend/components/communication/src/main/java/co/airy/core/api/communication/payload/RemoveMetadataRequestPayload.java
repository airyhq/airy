package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RemoveMetadataRequestPayload {
    @NotNull
    private String conversationId;
    @NotNull
    private String key;
}
