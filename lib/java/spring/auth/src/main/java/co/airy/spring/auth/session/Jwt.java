package co.airy.spring.auth.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

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

    public String getAuthToken(AiryAuth auth) throws JsonProcessingException {
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

    public AiryAuth loadFromToken(final String authHeader) throws Exception {
        Claims claims = extractClaims(authHeader);
        final String principalClaim = (String) claims.get(PRINCIPAL_CLAIM);
        final UserProfile profile = objectMapper.readValue(principalClaim, UserProfile.class);
        return new AiryAuth(profile);
    }


    private Key parseSigningKey(String tokenKey) {
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(tokenKey);
        return new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser().setSigningKey(signingKey).parseClaimsJws(token).getBody();
    }
}
