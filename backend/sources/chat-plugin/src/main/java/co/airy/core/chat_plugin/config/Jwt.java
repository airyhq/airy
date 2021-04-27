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
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
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
    public static final String CONVERSATION_ID_CLAIM = "conversation_id";
    public static final String CHANNEL_ID_CLAIM = "channel_id";
    public static final String RESUME_CONVERSATION_ID_CLAIM = "resume_conversation_id";
    public static final String RESUME_CHANNEL_ID_CLAIM = "resume_channel_id";
    private final Key signingKey;

    public Jwt(@Value("${chat-plugin.auth.jwt-secret}") String tokenKey) {
        this.signingKey = parseSigningKey(tokenKey);
    }

    public String getAuthToken(String conversationId, String channelId) {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(CONVERSATION_ID_CLAIM, conversationId);
        claims.put(CHANNEL_ID_CLAIM, channelId);

        JwtBuilder builder = Jwts.builder()
                .setSubject(conversationId)
                .setIssuedAt(now)
                .addClaims(claims)
                .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofHours(1)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public String getResumeToken(String conversationId, String channelId) {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(RESUME_CONVERSATION_ID_CLAIM, conversationId);
        claims.put(RESUME_CHANNEL_ID_CLAIM, channelId);

        JwtBuilder builder = Jwts.builder()
                .setSubject(conversationId)
                .setIssuedAt(now)
                .addClaims(claims)
                .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofDays(7)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public Principal authenticate(final String authHeader) throws ResponseStatusException {
        Claims claims = null;
        try {
            claims = extractClaims(authHeader);
        } catch (Exception e) {
            log.error("Failed to extract claims from token: " + e.getMessage());
        }

        if (claims == null) {
            throw new ResponseStatusException(UNAUTHORIZED);
        }

        try {
            final String conversationId = (String) claims.get(CONVERSATION_ID_CLAIM);
            final String channelId = (String) claims.get(CHANNEL_ID_CLAIM);
            return new Principal(channelId, conversationId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ResponseStatusException(UNAUTHORIZED);
        }
    }

    public Principal authenticateResume(final String resumeToken) throws ResponseStatusException {
        Claims claims = null;
        try {
            claims = extractClaims(resumeToken);
        } catch (Exception e) {
            log.error("Failed to extract claims from token: " + e.getMessage());
        }

        if (claims == null) {
            throw new ResponseStatusException(UNAUTHORIZED);
        }

        try {
            final String conversationId = (String) claims.get(RESUME_CONVERSATION_ID_CLAIM);
            final String channelId = (String) claims.get(RESUME_CHANNEL_ID_CLAIM);
            return new Principal(channelId, conversationId);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ResponseStatusException(UNAUTHORIZED);
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
