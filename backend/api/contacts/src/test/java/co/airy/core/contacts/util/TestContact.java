package co.airy.core.contacts.util;

import co.airy.core.contacts.dto.Contact;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.springframework.stereotype.Component;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Component
public class TestContact {

    private final WebTestHelper webTestHelper;
    private final ObjectMapper objectMapper;

    public TestContact(WebTestHelper webTestHelper) {
        this.webTestHelper = webTestHelper;
        this.objectMapper = new ObjectMapper();
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    public String createContact(Contact contact) throws Exception {
        final String requestPayload = objectMapper.writeValueAsString(contact);
        final String result = webTestHelper.post("/contacts.create", requestPayload)
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        final JsonNode jsonNode = objectMapper.readTree(result);
        return jsonNode.get("id").textValue();
    }
}
