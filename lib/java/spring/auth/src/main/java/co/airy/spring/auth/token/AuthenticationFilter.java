package co.airy.spring.auth.token;

import co.airy.spring.auth.Jwt;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class AuthenticationFilter extends OncePerRequestFilter {
    private final String systemToken;
    private final Jwt jwt;

    public AuthenticationFilter(String systemToken, Jwt jwt) {
        this.systemToken = systemToken;
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String authToken = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (authToken != null && authToken.startsWith("Bearer")) {
            authToken = authToken.substring(7);
        }

        if (authToken == null) {
            chain.doFilter(req, res);
            return;
        }

        Authentication authentication = getAuthentication(authToken);
        if (authentication == null) {
            res.sendError(403);
            return;
        }

        authentication.setAuthenticated(true);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private Authentication getAuthentication(String token) {
        if (systemToken != null && systemToken.equals(token)) {
            final TokenProfile profile = new TokenProfile(String.format("system-token-%s", token.substring(0, Math.min(token.length(), 4))), Map.of(), List.of());
            return new TokenAuth(profile);
        }

        try {
            return jwt.loadFromToken(token);
        } catch (Exception ignored) {
            return null;
        }
    }
}
