package co.airy.core.api.admin;

import co.airy.spring.auth.PrincipalAccess;
import co.airy.spring.auth.session.UserProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsersController {

    @PostMapping("/users.getProfile")
    ResponseEntity<?> getUserProfile(Authentication auth) {
        final UserProfile userProfile = PrincipalAccess.getUserProfile(auth);
        if (userProfile == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(userProfile);
    }
}
