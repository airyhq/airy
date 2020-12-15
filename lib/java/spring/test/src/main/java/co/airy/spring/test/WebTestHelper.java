package co.airy.spring.test;


import co.airy.spring.jwt.Jwt;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static co.airy.test.Timing.retryOnException;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class WebTestHelper {
    private final MockMvc mvc;
    private final Jwt jwt;

    WebTestHelper(MockMvc mvc, Jwt jwt) {
        this.mvc = mvc;
        this.jwt = jwt;
    }

    public void waitUntilHealthy() throws InterruptedException {
        retryOnException(() -> get("/actuator/health").andExpect(status().isOk()), "Application is not healthy");
    }

    public ResultActions post(String url, String body, String userId) throws Exception {
        return this.mvc.perform(MockMvcRequestBuilders.post(url)
                .headers(buildHeaders(userId))
                .content(body));
    }

    public ResultActions post(String url, String body) throws Exception {
        return this.mvc.perform(MockMvcRequestBuilders.post(url)
                .header(CONTENT_TYPE, APPLICATION_JSON.toString())
                .content(body));
    }

    public ResultActions get(String url) throws Exception {
        return this.mvc.perform(MockMvcRequestBuilders.get(url));
    }

    private HttpHeaders buildHeaders(final String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(AUTHORIZATION, jwt.tokenFor(userId));
        headers.add(CONTENT_TYPE, APPLICATION_JSON.toString());
        return headers;
    }
}
