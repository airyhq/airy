package co.airy.core.api.auth.controllers.payload;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Builder
@Data
public class InviteUserResponsePayload {
    private UUID id;
}
