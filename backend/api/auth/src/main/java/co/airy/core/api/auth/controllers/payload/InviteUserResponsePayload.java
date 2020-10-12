package co.airy.core.api.auth.controllers.payload;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class InviteUserResponsePayload {
    private String id;
}
