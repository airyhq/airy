package co.airy.spring.web.auth.jwt;

import co.airy.spring.web.auth.AuthenticationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
import org.javatuples.Pair;
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
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component
public class Jwt {
    private static final Logger log = AiryLoggerFactory.getLogger(Jwt.class);

    private static final String tokenKey = "sdfajlsdfjlkasdflkjklfadsljajkldsfljdfjklasdfjllfdjlskaldfsjfldjsaljfdksjlkfdssfdfdssfdfdsfsdfdssdffdsfdsdfssfdsdfdfsdgfsgffsggsfgsfasdfasfdasljadfsljkdfasjlkadfsjlkafdsljadfsjladfsljjlkdfsjlkadfsjlkafdsjlljdfkasjladfsajldfksjlkafdsjlkfdsljkadfsjlkdafsjlkdafsjlkadfsjlkadfsjlkbljkbjlfaskjlkqvjlksalajsfkljkfjlk";

    private Key signingKey;

    public static final String USER_ID_CLAIM = "user_id";
    private static final String ORGANIZATIONS_CLAIM = "organization_ids";
    public static final String OLD_PASSWORD_HASH_CLAIM = "old_password_hash";

    public Jwt() {
        this.signingKey = parseSigningKey();
    }

    public String tokenFor(String userId, List<String> organizationIds) {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(USER_ID_CLAIM, userId);
        if (organizationIds != null) {
            claims.put(ORGANIZATIONS_CLAIM, organizationIds);
        }

        JwtBuilder builder = Jwts.builder()
            .setId(userId)
            .setSubject(userId)
            .setIssuedAt(now)
            .addClaims(claims)
            .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofHours(1)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public String refreshTokenFor(String userId) {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(USER_ID_CLAIM, userId);

        JwtBuilder builder = Jwts.builder()
            .setId(userId)
            .setIssuedAt(now)
            .addClaims(claims)
            .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofDays(7)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    public String getResetToken(String userId, String oldPasswordHash) {
        Date now = Date.from(Instant.now());

        Map<String, Object> claims = new HashMap<>();
        claims.put(USER_ID_CLAIM, userId);
        claims.put(OLD_PASSWORD_HASH_CLAIM, oldPasswordHash);

        JwtBuilder builder = Jwts.builder()
            .setId(userId)
            .setIssuedAt(now)
            .addClaims(claims)
            .signWith(signingKey, SignatureAlgorithm.HS256);

        Date exp = Date.from(Instant.now().plus(Duration.ofDays(1)));
        builder.setExpiration(exp);

        return builder.compact();
    }

    //TODO better to change the signature here to return a class (so we don't depend on tuples)
    public Pair<String, List<String>> authenticate(final String authHeader) throws HttpClientErrorException.Unauthorized {
        Claims claims = null;
        if (authHeader != null) {
            try {
                claims = extractClaims(authHeader);
            } catch (Exception e) {
                log.error("Failed to extract claims from token: " + e.getMessage());
            }
        }

        if (claims == null) {
            throw HttpClientErrorException.create(UNAUTHORIZED, "Unauthorized", null, null, Charset.defaultCharset());
        }

        String userId;
        List<String> organizationIds;
        Pair<String, List<String>> result = null;
        try {
            userId = (String) claims.get(USER_ID_CLAIM);
            organizationIds = claims.get(ORGANIZATIONS_CLAIM, List.class);
            result = Pair.with(userId, organizationIds);
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        if (result == null) {
            throw HttpClientErrorException.create(UNAUTHORIZED, "Unauthorized", null, null, Charset.defaultCharset());
        }

        return result;
    }

    private Key parseSigningKey() {
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(Jwt.tokenKey);
        return new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
            .setSigningKey(signingKey)
            .parseClaimsJws(token).getBody();
    }

    public String extractId(String token) throws AuthenticationException {
        try {
            return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody()
                .getId();
        } catch (Exception e) {
            throw new AuthenticationException("Error while extracting a claim from jwt token", e);
        }
    }

    public Object extractClaim(String token, String claimKey) throws AuthenticationException {
        try {
            return Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody()
                .get(claimKey);
        } catch (Exception e) {
            throw new AuthenticationException("Error while extracting a claim from jwt token", e);
        }
    }
}
