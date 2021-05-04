package co.airy.spring.auth.token;

import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

@Data
public class TokenAuth implements Authentication {
    private String token;
    private String principal;
    private boolean isAuthenticated = false;

    public TokenAuth(String token) {
        this.principal = String.format("system-token-%s", token.substring(0, Math.min(token.length(), 4)));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public boolean isAuthenticated() {
        return this.isAuthenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.isAuthenticated = true;
    }


    @Override
    public String getName() {
        return principal;
    }
}
