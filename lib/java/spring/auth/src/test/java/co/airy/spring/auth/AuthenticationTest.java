package co.airy.spring.auth;

import co.airy.spring.auth.token.TokenAuth;
import co.airy.spring.auth.token.TokenProfile;
import co.airy.spring.core.AirySpringBootApplication;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "allowedOrigins=*",
        "systemToken=user-generated-api-token",
        "jwtSecret=long-randomly-generated-secret-used-as-jwt-secret-key",
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class AuthenticationTest {

    @Autowired
    private MockMvc mvc;

    @Value("${systemToken}")
    private String systemToken;

    @Value("${jwtSecret}")
    private String jwtSecret;

    @Test
    void rejectsMissingAuth() throws Exception {
        mvc.perform(post("/principal.get"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    void setsCorsHeaders() throws Exception {
        final String origin = "http://example.org";

        mvc.perform(options("/principal.get")
                .header("Access-Control-Request-Method", "GET")
                .header("Origin", origin))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", origin));
    }

    @Test
    void authenticatesSystemToken() throws Exception {
        mvc.perform(post("/principal.get")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.AUTHORIZATION, "hacker-generated-api-token"))
                .andExpect(status().isForbidden());

        mvc.perform(post("/principal.get")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.AUTHORIZATION, systemToken))
                .andExpect(status().isOk());
    }

    @Test
    void authenticatesJwt() throws Exception {
        final Jwt jwt = new Jwt(jwtSecret);

        mvc.perform(post("/principal.get")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.AUTHORIZATION, jwt.getAuthToken(new TokenAuth(new TokenProfile("Some name", null, null)), null)))
                .andExpect(status().isOk());
    }
}
