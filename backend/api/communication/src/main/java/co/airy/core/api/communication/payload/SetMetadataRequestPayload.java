package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SetMetadataRequestPayload {
    @NotNull
    private String conversationId;
    @NotNull
    @Pattern(regexp = "^((?!__.*__).)*$")
    private String key;
    @NotNull
    private String value;
}
