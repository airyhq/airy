package co.airy.spring.jwt;

import co.airy.log.AiryLoggerFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class Jwt {
    private static final Logger log = AiryLoggerFactory.getLogger(Jwt.class);

    private final Key signingKey;
    public static final String USER_ID_CLAIM = "user_id";

    public Jwt(@Value("${auth.jwt-secret}") String tokenKey) {
        this.signingKey = parseSigningKey(tokenKey);
    }

    public String tokenFor(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(USER_ID_CLAIM, userId);

        return tokenFor(userId, claims);
    }

    public String tokenFor(String userId, Map<String, Object> claims) {
        Date now = Date.from(Instant.now());

        JwtBuilder builder = Jwts.builder()
                .setId(userId)
                .setSubject(userId)
                .setIssuedAt(now)
                .addClaims(claims)
                .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofDays(1)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public String authenticate(final String authHeader) {
        Claims claims = null;
        if (authHeader != null) {
            try {
                claims = extractClaims(authHeader);
            } catch (Exception e) {
                log.error("Failed to extract claims from token: " + e.getMessage());
            }
        }

        if (claims == null) {
            return null;
        }

        String userId;
        try {
            userId = (String) claims.get(USER_ID_CLAIM);
            return userId;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public Map<String, Object> getClaims(String token) {
        return extractClaims(token);
    }

    private Key parseSigningKey(String tokenKey) {
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(tokenKey);
        return new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser().setSigningKey(signingKey).parseClaimsJws(token).getBody();
    }
}

