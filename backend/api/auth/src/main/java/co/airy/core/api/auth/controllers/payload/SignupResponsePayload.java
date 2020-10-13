package co.airy.core.api.auth.controllers.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupResponsePayload {
    private String id;
    private String firstName;
    private String lastName;
    private String token;
}
