package co.airy.spring.auth.oidc;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class EmailFilter extends OncePerRequestFilter {
    private final ConfigProvider configProvider;

    public EmailFilter(ConfigProvider config) {
        this.configProvider = config;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof OAuth2AuthenticationToken) {
            final OAuth2User user = ((OAuth2AuthenticationToken) auth).getPrincipal();
            final List<String> emails = getEmails(user);


            if (emails.stream().noneMatch(configProvider::emailMatches)) {
                res.sendError(403, "Email not allowed");
                return;
            }
        }

        chain.doFilter(req, res);
    }

    private List<String> getEmails(OAuth2User user) {
        final ArrayList<String> emails = new ArrayList<>();

        final Map<String, Object> attrs = user.getAttributes();
        Optional.ofNullable(attrs.get("email"))
                .ifPresent((email) -> emails.add((String) email));

        Optional.ofNullable(attrs.get("emails"))
                .ifPresent((allEmails) -> emails.addAll((Collection<String>) allEmails));

        return emails;
    }
}
