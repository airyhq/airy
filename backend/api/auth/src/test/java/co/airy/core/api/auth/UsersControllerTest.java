package co.airy.core.api.auth;

import co.airy.core.api.auth.controllers.UsersController;
import co.airy.core.api.auth.dao.InvitationDAO;
import co.airy.core.api.auth.dto.Invitation;
import co.airy.core.api.auth.services.Mail;
import co.airy.spring.core.AirySpringBootApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    private InvitationDAO invitationDAO;

    @MockBean
    private Mail mail;

    @Autowired
    @InjectMocks
    private UsersController usersController;

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void userSignupAndLogin() throws Exception {
        final String firstName = "grace";
        final String email = "grace@airy.co";
        final String password = "trustno1";

        final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"" + firstName + "\"," +
                "\"last_name\":\"hopper\",\"password\":\"" + password + "\"}";

        final String responseString = mvc.perform(post("/users.signup")
                .content(signUpRequest)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(nullValue())))
                .andReturn()
                .getResponse()
                .getContentAsString();

        final JsonNode jsonNode = objectMapper.readTree(responseString);
        final String id = jsonNode.get("id").textValue();

        final String loginRequest = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";

        mvc.perform(post("/users.login")
                .content(loginRequest)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(id)))
                .andExpect(jsonPath("$.first_name", equalTo(firstName)))
                .andExpect(jsonPath("$.token", not(nullValue())));

        final String loginRequestWrongPwd = "{\"email\":\"" + email + "\",\"password\":\"guess-i-should-have-trusted-a-password-manager\"}";

        mvc.perform(post("/users.login")
                .content(loginRequestWrongPwd)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void requestPasswordReset() throws Exception {
        final String email = "ada@airy.co";

        final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"something\"," +
                "\"last_name\":\"hopper\",\"password\":\"trustno1\"}";

        mvc.perform(post("/users.signup")
                .content(signUpRequest)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()));

        final String passwordResetRequest = "{\"email\":\"" + email + "\"}";

        doNothing().when(mail).sendMail(Mockito.eq(email), Mockito.anyString(), Mockito.anyString());

        mvc.perform(post("/users.request-password-reset")
                .content(passwordResetRequest)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString()))
                .andExpect(status().isOk());

        TimeUnit.MILLISECONDS.sleep(500);

        Mockito.verify(mail).sendMail(Mockito.eq(email), Mockito.anyString(), Mockito.anyString());
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

