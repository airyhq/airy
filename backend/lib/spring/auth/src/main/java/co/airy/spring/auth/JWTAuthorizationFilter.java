package co.airy.spring.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationManager;

import javax.crypto.spec.SecretKeySpec;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.security.Key;
import java.util.ArrayList;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private static final String tokenKey = "sdfajlsdfjlkasdflkjklfadsljajkldsfljdfjklasdfjllfdjlskaldfsjfldjsaljfdksjlkfdssfdfdssfdfdsfsdfdssdffdsfdsdfssfdsdfdfsdgfsgffsggsfgsfasdfasfdasljadfsljkdfasjlkadfsjlkafdsljadfsjladfsljjlkdfsjlkadfsjlkafdsjlljdfkasjladfsajldfksjlkafdsjlkfdsljkadfsjlkdafsjlkdafsjlkadfsjlkadfsjlkbljkbjlfaskjlkqvjlksalajsfkljkfjlk";

    public JWTAuthorizationFilter(AuthenticationManager authManager) {
        super(authManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null) {
            chain.doFilter(req, res);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = getAuthentication(req);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(req, res);
    }
    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (token != null) {
            final String user = Jwts.parser()
                    .setSigningKey(parseSigningKey())
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            if (user != null) {
                return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
            }
            return null;
        }
        return null;
    }

    private Key parseSigningKey() {
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(tokenKey);
        return new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
    }
}
