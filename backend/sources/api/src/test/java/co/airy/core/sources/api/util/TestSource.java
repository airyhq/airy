package co.airy.core.sources.api.util;

import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class TestSource {
    @Autowired
    WebTestHelper webTestHelper;

    public String createSourceAndGetToken(String sourceId) throws Exception {
        String payload = "{\"source_id\":\"" + sourceId + "\"}";

        final String response = webTestHelper.post("/sources.create", payload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.source_id", is(not(nullValue()))))
                .andExpect(jsonPath("$.token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();

        final JsonNode node = new ObjectMapper().readTree(response);
        return node.get("token").textValue();
    }
}
