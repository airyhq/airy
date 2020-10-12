package co.airy.core.api.auth;

import co.airy.core.api.auth.dao.InvitationDAO;
import co.airy.core.api.auth.dao.UserDAO;
import co.airy.core.api.auth.dto.Invitation;
import co.airy.core.api.auth.dto.User;
import co.airy.spring.core.AirySpringBootApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

@AutoConfigureEmbeddedDatabase(beanName = "dataSource")
@SpringBootTest(properties = {
        "db.debug=true"
}, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@FlywayDataSource
public class UsersControllerTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private InvitationDAO invitationDAO;

    @Test
    void userSignup() throws Exception {
        userDAO.insert(User.builder().id(UUID.randomUUID()).build());

        // TODO write signup api test
    }

    @Test
    void createsInvitation() throws Exception {
        final String rawResponse = mvc.perform(post("/users.invite")
                .headers(buildHeader())
                .content("{\"email\": \"katherine.johnson@nasa.gov\"}"))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        final String invitationId = objectMapper.readValue(rawResponse, JsonNode.class).get("id").asText();
        assertThat(invitationId, is(not(nullValue())));

        final List<Invitation> invitations = invitationDAO.listInvitations();
        assertThat(invitations, hasSize(1));
    }

    private HttpHeaders buildHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString());
        return headers;
    }
}

