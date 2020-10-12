package co.airy.core.api.auth.controllers;

import co.airy.core.api.auth.controllers.payload.InviteUserRequestPayload;
import co.airy.core.api.auth.controllers.payload.InviteUserResponsePayload;
import co.airy.core.api.auth.controllers.payload.SignupRequestPayload;
import co.airy.core.api.auth.dao.InvitationDAO;
import co.airy.core.api.auth.dto.Invitation;
import co.airy.payload.response.EmptyResponsePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.UUID;

@RestController
public class UsersController {

    @Autowired
    private InvitationDAO invitationDAO;

    @PostMapping("/users.signup")
    ResponseEntity<?> signupUser(@RequestBody @Valid SignupRequestPayload signupRequestPayload) {
        // TODO
        return ResponseEntity.ok(new EmptyResponsePayload());
    }

    @PostMapping("/users.invite")
    ResponseEntity<?> inviteUser(@RequestBody @Valid InviteUserRequestPayload inviteUserRequestPayload) {
        final UUID id = UUID.randomUUID();
        final Instant now = Instant.now();

        invitationDAO.insert(Invitation.builder()
                .id(id)
                .acceptedAt(null)
                .createdAt(now)
                .email(inviteUserRequestPayload.getEmail())
                .sentAt(null)
                .updatedAt(now)
                .user(null)
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(InviteUserResponsePayload.builder()
                .id(id.toString())
                .build());
    }
}
