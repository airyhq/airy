package co.airy.spring.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestApp {

    @PostMapping("/jwt.get")
    ResponseEntity<?> echoPrincipal(Authentication authentication) {
        final String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(new JwtDetails(userId));
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class JwtDetails {
    private String userId;
}
