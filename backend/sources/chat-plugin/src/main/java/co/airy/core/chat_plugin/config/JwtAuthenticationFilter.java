package co.airy.core.chat_plugin.config;

import co.airy.core.chat_plugin.Principal;
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

import static co.airy.core.chat_plugin.Headers.getAuthToken;

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
    private final Jwt jwt;
    private final String systemToken;
    private final String systemTokenPrincipal;

    public JwtAuthenticationFilter(AuthenticationManager authManager, Jwt jwt, String systemToken) {
        super(authManager);
        this.jwt = jwt;
        this.systemToken = systemToken;
        this.systemTokenPrincipal = systemToken == null ? null : String.format("system-token-%s", systemToken.substring(0, Math.min(systemToken.length(), 4)));
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
        if (systemToken != null && systemToken.equals(token)) {
            return new UsernamePasswordAuthenticationToken(systemTokenPrincipal, null, List.of());
        }

        final Principal principal = jwt.authenticate(token);

        if (principal != null) {
            return new UsernamePasswordAuthenticationToken(principal, null, List.of());
        }
        return null;
    }
}
