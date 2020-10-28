package co.airy.core.chat_plugin.config;

import co.airy.core.chat_plugin.Principal;
import co.airy.log.AiryLoggerFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.nio.charset.Charset;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component
public class Jwt {
    private static final Logger log = AiryLoggerFactory.getLogger(Jwt.class);
    public static final String SESSION_ID_CLAIM = "session_id";
    public static final String CHANNEL_ID_CLAIM = "channel_id";
    private final Key signingKey;

    public Jwt(@Value("${chat-plugin.auth.jwt-secret}") String tokenKey) {
        this.signingKey = parseSigningKey(tokenKey);
    }

    public String tokenFor(String sessionId, String channelId) {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(SESSION_ID_CLAIM, sessionId);
        claims.put(CHANNEL_ID_CLAIM, channelId);

        JwtBuilder builder = Jwts.builder()
                .setId(sessionId)
                .setSubject(sessionId)
                .setIssuedAt(now)
                .addClaims(claims)
                .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofHours(1)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public Principal authenticate(final String authHeader) throws HttpClientErrorException.Unauthorized {
        Claims claims = null;
        if (authHeader != null) {
            try {
                claims = extractClaims(authHeader);
            } catch (Exception e) {
                log.error("Failed to extract claims from token: " + e.getMessage());
            }
        }

        if (claims == null) {
            throw new HttpClientErrorException(UNAUTHORIZED, "Unauthorized", null, null, Charset.defaultCharset());
        }

        try {
            final String sessionId = (String) claims.get(SESSION_ID_CLAIM);
            final String channelId = (String) claims.get(CHANNEL_ID_CLAIM);
            return Principal.builder().sessionId(sessionId).channelId(channelId).build();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new HttpClientErrorException(UNAUTHORIZED, "Unauthorized", null, null, Charset.defaultCharset());
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
