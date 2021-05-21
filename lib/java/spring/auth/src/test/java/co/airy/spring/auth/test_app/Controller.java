package co.airy.spring.auth.test_app;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    @PostMapping("/principal.get")
    ResponseEntity<?> echoPrincipal(Authentication authentication) {
        final String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(new PrincipalDetails(userId));
    }


    @PostMapping("/data.get")
    ResponseEntity<?> getData() {
        return ResponseEntity.ok().build();
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class PrincipalDetails {
    private String userId;
}
