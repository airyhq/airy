package co.airy.core.api.auth.controllers.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestPayload {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
