package co.airy.core.sources.facebook.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExploreRequestPayload {
    @NotNull
    String authToken;
}
