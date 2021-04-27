package co.airy.core.api.admin;

import co.airy.spring.auth.oidc.ProfileData;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import static co.airy.spring.auth.PrincipalAccess.getProfileData;

@RestController
public class UsersController {

    @PostMapping("/users.getProfile")
    ResponseEntity<?> getUserProfile(Authentication auth) {
        final ProfileData profileData = getProfileData(auth);
        if (profileData == null) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.ok(profileData);
    }
}
