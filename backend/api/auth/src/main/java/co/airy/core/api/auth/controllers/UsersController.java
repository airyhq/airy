package co.airy.core.api.auth.controllers;

import co.airy.core.api.auth.controllers.payload.ListResponsePayload;
import co.airy.core.api.auth.controllers.payload.LoginRequestPayload;
import co.airy.core.api.auth.controllers.payload.SignupRequestPayload;
import co.airy.core.api.auth.controllers.payload.UserPayload;
import co.airy.core.api.auth.dao.UserDAO;
import co.airy.core.api.auth.dto.User;
import co.airy.core.api.auth.services.Password;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.jdbi.v3.core.statement.UnableToExecuteStatementException;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@RestController
public class UsersController {
    private final UserDAO userDAO;
    private final Password passwordService;

    public UsersController(Password passwordService, UserDAO userDAO) {
        this.passwordService = passwordService;
        this.userDAO = userDAO;
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
        } catch (UnableToExecuteStatementException  e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(UserPayload.builder()
                .firstName(firstName)
                .lastName(lastName)
                .token("deprecated: Use system token instead")
                .id(userId.toString())
                .build()
        );
    }

    @PostMapping("/users.login")
    ResponseEntity<UserPayload> loginUser(@RequestBody @Valid LoginRequestPayload loginRequestPayload) {
        final String password = loginRequestPayload.getPassword();
        final String email = loginRequestPayload.getEmail();

        final User user = userDAO.findByEmail(email);

        if (user == null || !passwordService.passwordMatches(password, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(UserPayload.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .token("deprecated: Use system token instead")
                .id(user.getId().toString())
                .build()
        );
    }

    @PostMapping("/users.list")
    ResponseEntity<ListResponsePayload> listUsers() {
        final List<User> users = userDAO.list();

        ListResponsePayload listResponsePayload = new ListResponsePayload();

        listResponsePayload.setData(users
                .stream()
                .map(u -> UserPayload.builder()
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .token(null)
                        .id(u.getId().toString())
                        .build())
                .collect(toList()));

        return ResponseEntity.ok(listResponsePayload);
    }

}
