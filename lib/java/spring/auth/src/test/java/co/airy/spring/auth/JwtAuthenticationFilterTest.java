package co.airy.spring.auth;

import co.airy.spring.jwt.Jwt;
import co.airy.spring.core.AirySpringBootApplication;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "auth.jwt-secret=424242424242424242424242424242424242424242424242424242"
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class JwtAuthenticationFilterTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private Jwt jwt;

    @Test
    void rejectsMissingJwt() throws Exception {
        mvc.perform(post("/jwt.get"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    void setsCorsHeaders() throws Exception {
        final String origin = "http://example.org";

        mvc.perform(options("/jwt.get")
                .header("Access-Control-Request-Method", "GET")
                .header("Origin", origin)
        )
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", origin));
    }

    @Test
    void rejectsInvalidJwt() throws Exception {
        mvc.perform(post("/jwt.get")
                .header(HttpHeaders.AUTHORIZATION, "not a jwt")
        )
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    void authenticatesUser() throws Exception {
        final String userId = "user-id";
        final String token = jwt.tokenFor(userId);

        mvc.perform(post("/jwt.get")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header(HttpHeaders.AUTHORIZATION, token)
        )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id", equalTo(userId)));
    }
}
