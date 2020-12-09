package co.airy.core.api.auth.controllers;

import co.airy.core.api.auth.controllers.payload.AcceptInvitationRequestPayload;
import co.airy.core.api.auth.controllers.payload.AcceptInvitationResponsePayload;
import co.airy.core.api.auth.controllers.payload.InviteUserRequestPayload;
import co.airy.core.api.auth.controllers.payload.InviteUserResponsePayload;
import co.airy.core.api.auth.controllers.payload.LoginRequestPayload;
import co.airy.core.api.auth.controllers.payload.LoginResponsePayload;
import co.airy.core.api.auth.controllers.payload.PasswordResetRequestPayload;
import co.airy.core.api.auth.controllers.payload.SignupRequestPayload;
import co.airy.core.api.auth.controllers.payload.SignupResponsePayload;
import co.airy.core.api.auth.dao.InvitationDAO;
import co.airy.core.api.auth.dao.UserDAO;
import co.airy.core.api.auth.dto.Invitation;
import co.airy.core.api.auth.dto.User;
import co.airy.core.api.auth.services.Mail;
import co.airy.core.api.auth.services.Password;
import co.airy.spring.jwt.Jwt;
import co.airy.payload.response.EmptyResponsePayload;
import co.airy.payload.response.RequestErrorResponsePayload;
import co.airy.spring.auth.IgnoreAuthPattern;
import org.jdbi.v3.core.statement.UnableToExecuteStatementException;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
public class UsersController {
    public static final String RESET_PWD_FOR = "reset_pwd_for";
    private final InvitationDAO invitationDAO;
    private final UserDAO userDAO;
    private final Password passwordService;
    private final Jwt jwt;
    private final Mail mail;
    private final ExecutorService executor;

    public UsersController(Password passwordService, UserDAO userDAO, InvitationDAO invitationDAO, Jwt jwt, Mail mail) {
        this.passwordService = passwordService;
        this.userDAO = userDAO;
        this.invitationDAO = invitationDAO;
        this.jwt = jwt;
        this.mail = mail;
        executor = Executors.newSingleThreadExecutor();
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/users.signup", "/users.login", "/users.request-password-reset", "/users.password-reset");
    }

    @PostMapping("/users.signup")
    ResponseEntity<?> signupUser(@RequestBody @Valid SignupRequestPayload signupRequestPayload) {
        final String password = signupRequestPayload.getPassword();

        if (!passwordService.isPasswordValid(password)) {
            return ResponseEntity.badRequest().body(new RequestErrorResponsePayload("password is not valid"));
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

        try {
            userDAO.insert(user);
        } catch (UnableToExecuteStatementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(SignupResponsePayload.builder()
                .firstName(firstName)
                .lastName(lastName)
                .token(jwt.tokenFor(userId.toString()))
                .id(userId.toString())
                .build()
        );
    }

    @PostMapping("/users.login")
    ResponseEntity<LoginResponsePayload> loginUser(@RequestBody @Valid LoginRequestPayload loginRequestPayload) {
        final String password = loginRequestPayload.getPassword();
        final String email = loginRequestPayload.getEmail();

        final User user = userDAO.findByEmail(email);

        if (user == null || !passwordService.passwordMatches(password, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(LoginResponsePayload.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(jwt.tokenFor(user.getId().toString()))
                .id(user.getId().toString())
                .build()
        );
    }

    @PostMapping("/users.request-password-reset")
    ResponseEntity<?> requestPasswordReset(@RequestBody @Valid LoginRequestPayload loginRequestPayload) {
        final String email = loginRequestPayload.getEmail();

        // We execute async so that attackers cannot infer the presence of an email address
        // based on response time.
        executor.submit(() -> requestResetFor(email));
        return ResponseEntity.ok(new EmptyResponsePayload());
    }

    @PostMapping("/users.password-reset")
    ResponseEntity<?> passwordReset(@RequestBody @Valid PasswordResetRequestPayload payload) {
        Map<String, Object> claims = jwt.getClaims(payload.getToken());
        final String userId = (String) claims.get(RESET_PWD_FOR);
        final User user = userDAO.findById(UUID.fromString(userId));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (!payload.getToken().equals(getResetToken(userId))) {
            return ResponseEntity.badRequest().build();
        }

        userDAO.changePassword(UUID.fromString(userId), passwordService.hashPassword(payload.getNewPassword()));

        return ResponseEntity.ok(new EmptyResponsePayload());
    }

    private void requestResetFor(String email) {
        final User user = userDAO.findByEmail(email);

        if (user != null) {
            final String emailBody = String.format("Hello %s,\na reset was requested for your airy core account. " +
                            "If this was not you, please ignore this email. Otherwise you can use this token to change your password: %s\n",
                    user.getFullName(), getResetToken(user.getId().toString())
            );

            mail.send(email, "Password reset", emailBody);
        }
    }

    private String getResetToken(String userId) {
        Map<String, Object> refreshClaim = Map.of(RESET_PWD_FOR, userId);

        return jwt.tokenFor(userId, refreshClaim);
    }

    //TODO: Write a custom ExceptionHandler for JDBI
    @PostMapping("/users.invite")
    ResponseEntity<InviteUserResponsePayload> inviteUser(@RequestBody @Valid InviteUserRequestPayload inviteUserRequestPayload) {
        final UUID id = UUID.randomUUID();
        final Instant now = Instant.now();

        invitationDAO.insert(Invitation.builder()
                .id(id)
                .acceptedAt(null)
                .createdAt(now)
                .email(inviteUserRequestPayload.getEmail())
                .sentAt(null)
                .updatedAt(now)
                .createdBy(null)
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(InviteUserResponsePayload.builder()
                .id(id)
                .build());
    }

    @PostMapping("/users.accept-invitation")
    ResponseEntity<?> acceptInvitation(@RequestBody @Valid AcceptInvitationRequestPayload payload) {
        final Invitation invitation = invitationDAO.findById(payload.getId());

        if (!invitationDAO.accept(invitation.getId(), Instant.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new EmptyResponsePayload());
        }

        final User user = User.builder()
                .id(UUID.randomUUID())
                .email(invitation.getEmail())
                .firstName(payload.getFirstName())
                .lastName(payload.getLastName())
                .passwordHash(passwordService.hashPassword(payload.getPassword()))
                .build();

        userDAO.insert(user);

        return ResponseEntity.ok(AcceptInvitationResponsePayload.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token(jwt.tokenFor(user.getId().toString()))
                .id(user.getId().toString())
                .build()
        );
    }
}
