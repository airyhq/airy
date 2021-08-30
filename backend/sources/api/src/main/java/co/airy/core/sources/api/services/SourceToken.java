package co.airy.core.sources.api.services;

import co.airy.avro.communication.Source;
import co.airy.core.sources.api.Stores;
import co.airy.spring.auth.Jwt;
import co.airy.spring.auth.token.TokenAuth;
import co.airy.spring.auth.token.TokenProfile;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class SourceToken {
    private final Jwt jwt;
    private final Stores stores;
    private final String sourceKey = "source";
    private final String identityError = "Wrong identity used. Use the authentication token you obtained for your app from the /sources.create endpoint. See https://docs.airy.co/api/source#create-a-source";

    public SourceToken(@Value("${jwtSecret}") String jwtSecret, Stores stores) {
        jwt = new Jwt(jwtSecret);
        this.stores = stores;
    }

    public String getSourceToken(String sourceId) {
        final TokenProfile tokenProfile = TokenProfile.builder()
                .name(String.format("source_app:%s", sourceId))
                .data(Map.of(sourceKey, sourceId)).build();
        try {
            // Source tokens don't expire
            return jwt.getAuthToken(new TokenAuth(tokenProfile), null);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void rejectSourceAuth(Authentication authentication) throws ResponseStatusException {
        if (!(authentication instanceof TokenAuth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        Map<String, String> tokenData = ((TokenAuth) authentication).getProfile().getData();
        if (tokenData.containsKey(sourceKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, identityError);
        }
    }

    public Source getSource(Authentication authentication) throws ResponseStatusException {
        final String sourceId = getSourceId(authentication);
        final Source source = stores.getSource(sourceId);
        if (source == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Source not found");
        }
        return source;
    }

    private String getSourceId(Authentication authentication) throws ResponseStatusException {
        if (!(authentication instanceof TokenAuth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, identityError);
        }

        Map<String, String> tokenData = ((TokenAuth) authentication).getProfile().getData();
        if (!tokenData.containsKey(sourceKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, identityError);
        }

        return tokenData.get(sourceKey);
    }
}
