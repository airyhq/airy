package co.airy.core.api.auth.controllers;

import co.airy.core.api.auth.controllers.payload.InviteUserRequestPayload;
import co.airy.core.api.auth.controllers.payload.InviteUserResponsePayload;
import co.airy.core.api.auth.controllers.payload.SignupRequestPayload;
import co.airy.core.api.auth.dao.InvitationDAO;
import co.airy.core.api.auth.dto.Invitation;
import co.airy.payload.response.EmptyResponsePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import co.airy.core.api.auth.controllers.payload.SignupResponsePayload;
import co.airy.core.api.auth.dao.UserDAO;
import co.airy.core.api.auth.dto.User;
import co.airy.core.api.auth.services.Password;
import co.airy.payload.response.RequestError;
import co.airy.spring.web.Jwt;
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

    private final UserDAO userDAO;
    private final Password passwordService;
    private final Jwt jwt;

    public UsersController(Password passwordService, UserDAO userDAO, Jwt jwt) {
        this.passwordService = passwordService;
        this.userDAO = userDAO;
        this.jwt = jwt;
    }

    @PostMapping("/users.signup")
    ResponseEntity<?> signupUser(@RequestBody @Valid SignupRequestPayload signupRequestPayload) {
        final String password = signupRequestPayload.getPassword();

        if (!passwordService.isPasswordValid(password)) {
            return ResponseEntity.badRequest().body(new RequestError("password is not valid"));
        }

        final UUID userId = UUID.randomUUID();
        final String firstName = signupRequestPayload.getFirstName();
        final String lastName = signupRequestPayload.getLastName();

        final User user = User.builder()
                .email(signupRequestPayload.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .id(userId)
                .passwordHash(passwordService.hashPassword(password))
                .build();

        userDAO.insert(user);

        return ResponseEntity.ok(SignupResponsePayload.builder()
                .firstName(firstName)
                .lastName(lastName)
                .token(jwt.tokenFor(userId.toString()))
                .id(userId.toString())
                .build()
        );
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
