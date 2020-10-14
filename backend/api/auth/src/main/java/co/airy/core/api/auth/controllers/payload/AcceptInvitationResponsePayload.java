package co.airy.core.api.auth.controllers.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptInvitationResponsePayload {
    private String id;
    private String firstName;
    private String lastName;
    private String token;
}
