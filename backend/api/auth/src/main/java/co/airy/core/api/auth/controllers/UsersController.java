package co.airy.core.api.auth.controllers;

import co.airy.core.api.auth.controllers.payload.SignupRequestPayload;
import co.airy.payload.response.EmptyResponsePayload;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class UsersController {

    @PostMapping("/users.signup")
    ResponseEntity<?> signupUser(@RequestBody @Valid SignupRequestPayload signupRequestPayload) {
        // TODO
        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}
