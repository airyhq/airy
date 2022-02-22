package co.airy.spring.auth;

import co.airy.spring.auth.session.UserAuth;
import co.airy.spring.auth.session.UserProfile;
import co.airy.spring.auth.token.TokenAuth;
import co.airy.spring.auth.token.TokenProfile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.Authentication;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Jwt {
    public static final String PRINCIPAL_CLAIM = "principal";
    private final ObjectMapper objectMapper;
    private final Key signingKey;

    public Jwt(String tokenKey) {
        this.signingKey = parseSigningKey(tokenKey);
        this.objectMapper = new ObjectMapper();
    }

    public String getAuthToken(UserAuth auth) throws JsonProcessingException {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(PRINCIPAL_CLAIM, objectMapper.writeValueAsString(auth.getPrincipal()));

        JwtBuilder builder = Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(auth.getPrincipal().getName())
                .setIssuedAt(now)
                .addClaims(claims)
                .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofDays(30)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public String getAuthToken(TokenAuth auth, Duration expiry) throws JsonProcessingException {
        Map<String, Object> claims = new HashMap<>();
        claims.put(PRINCIPAL_CLAIM, objectMapper.writeValueAsString(auth.getPrincipal()));

        JwtBuilder builder = Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(auth.getPrincipal().getName())
                .setIssuedAt(Date.from(Instant.now()))
                .addClaims(claims)
                .signWith(signingKey, SignatureAlgorithm.HS256);

        if (expiry != null) {
            Date exp = Date.from(Instant.now().plus(expiry));
            builder.setExpiration(exp);
        }
        return builder.compact();
    }

    public Authentication loadFromToken(final String token) throws Exception {
        Claims claims = extractClaims(token);
        final String principalClaim = (String) claims.get(PRINCIPAL_CLAIM);
        try {
            return new UserAuth(objectMapper.readValue(principalClaim, UserProfile.class));
        } catch (Exception e) {
            return new TokenAuth(objectMapper.readValue(principalClaim, TokenProfile.class));
        }
    }


    private Key parseSigningKey(String tokenKey) {
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(tokenKey);
        return new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser().setSigningKey(signingKey).parseClaimsJws(token).getBody();
    }
}
