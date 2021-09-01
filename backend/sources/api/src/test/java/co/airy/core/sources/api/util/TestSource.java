package co.airy.core.sources.api.util;

import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
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
        return createSourceAndGetToken(sourceId, null);
    }

    public String createSourceAndGetToken(String sourceId, String actionEndpoint) throws Exception {
        String payload = String.format("{\"source_id\":\"%s\"}", sourceId);
        if (actionEndpoint != null) {
            payload = String.format("{\"source_id\":\"%s\",\"action_endpoint\":\"%s\"}", sourceId, actionEndpoint);
        }

        final String response = webTestHelper.post("/sources.create", payload)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.source_id", is(not(nullValue()))))
                .andExpect(jsonPath("$.token", is(not(nullValue()))))
                .andReturn().getResponse().getContentAsString();

        retryOnException(() -> webTestHelper.post("/sources.list")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data[*].source_id", contains(equalTo(sourceId)))),
                "Source did not show up in store"
        );

        final JsonNode node = new ObjectMapper().readTree(response);
        return node.get("token").textValue();
    }
}
