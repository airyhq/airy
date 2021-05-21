package co.airy.spring.test;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static co.airy.test.Timing.retryOnException;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class WebTestHelper {
    private final MockMvc mvc;
    private final String systemToken;

    WebTestHelper(MockMvc mvc, @Value("${systemToken:#{null}}") String systemToken) {
        this.mvc = mvc;
        this.systemToken = systemToken;
    }

    public void waitUntilHealthy() throws InterruptedException {
        retryOnException(() -> get("/actuator/health").andExpect(status().isOk()), "Application is not healthy");
    }

    public ResultActions post(String url, String body) throws Exception {
        return this.mvc.perform(MockMvcRequestBuilders.post(url)
                .header(CONTENT_TYPE, APPLICATION_JSON.toString())
                .content(body));
    }

    public ResultActions post(String url) throws Exception {
        return this.mvc.perform(MockMvcRequestBuilders.post(url));
    }

    public ResultActions get(String url) throws Exception {
        return this.mvc.perform(MockMvcRequestBuilders.get(url));
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(CONTENT_TYPE, APPLICATION_JSON.toString());
        if (this.systemToken != null) {
            headers.setBearerAuth(this.systemToken);
        }
        return headers;
    }
}
