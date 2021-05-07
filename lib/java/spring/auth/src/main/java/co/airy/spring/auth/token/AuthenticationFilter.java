package co.airy.spring.auth.token;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthenticationFilter extends OncePerRequestFilter {
    private final String systemToken;

    public AuthenticationFilter(String systemToken) {
        this.systemToken = systemToken;
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

        TokenAuth authentication = getAuthentication(authToken);
        if (authentication == null) {
            res.sendError(403, "system token does not match");
            return;
        }

        authentication.setAuthenticated(true);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private TokenAuth getAuthentication(String token) {
        if (systemToken != null && systemToken.equals(token)) {
            return new TokenAuth(token);
        }

        return null;
    }
}
