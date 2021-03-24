package co.airy.core.chat_plugin.config;

import co.airy.core.chat_plugin.Principal;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import static co.airy.spring.web.Headers.getAuthToken;

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
    private final Jwt jwt;

    public JwtAuthenticationFilter(AuthenticationManager authManager, Jwt jwt) {
        super(authManager);
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String authToken = getAuthToken(req);

        if (authToken == null) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(authToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String token) {
        final Principal principal = jwt.authenticate(token);

        if (principal != null) {
            return new UsernamePasswordAuthenticationToken(principal, null, List.of());
        }
        return null;
    }
}
