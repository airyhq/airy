package co.airy.spring.auth;

import co.airy.spring.jwt.Jwt;
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

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {

    private final Jwt jwt;
    private final String systemToken;
    private final String apiTokenPrincipal;

    public JwtAuthenticationFilter(AuthenticationManager authManager, Jwt jwt, String systemToken) {
        super(authManager);
        this.jwt = jwt;
        this.systemToken = systemToken;
        this.apiTokenPrincipal = systemToken == null ? null : String.format("system-token-%s", systemToken.substring(0, Math.min(systemToken.length(), 4)));
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

        UsernamePasswordAuthenticationToken authentication = getAuthentication(authToken);
        if (authentication == null) {
            res.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String token) {
        if (systemToken != null && systemToken.equals(token)) {
            return new UsernamePasswordAuthenticationToken(apiTokenPrincipal, null, List.of());
        }

        final String user = jwt.authenticate(token);

        if (user != null) {
            return new UsernamePasswordAuthenticationToken(user, null, List.of());
        }
        return null;
    }

}
