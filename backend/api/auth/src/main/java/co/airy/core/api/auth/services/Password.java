package co.airy.core.api.auth.services;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class Password {
    private final Argon2PasswordEncoder argon = new Argon2PasswordEncoder();

    public boolean isPasswordValid(String password) {
        return password.length() > 6;
    }

    public String hashPassword(String password) {
        return argon.encode(password);
    }

    public boolean passwordMatches(String password, String hashedPassword) {
        return argon.matches(password, hashedPassword);
    }
}
