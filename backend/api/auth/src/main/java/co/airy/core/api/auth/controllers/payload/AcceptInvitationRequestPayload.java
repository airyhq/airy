package co.airy.core.api.auth.controllers.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AcceptInvitationRequestPayload {
    private UUID id;
    private String firstName;
    private String lastName;
    private String password;
}
