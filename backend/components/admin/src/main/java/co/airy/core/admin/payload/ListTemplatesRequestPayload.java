package co.airy.core.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListTemplatesRequestPayload {
    private String name;
    @NotNull
    private String source;
}
