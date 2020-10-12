package co.airy.core.api.auth.controllers.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InviteUserRequestPayload {
    private String email;
}
