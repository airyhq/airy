package co.airy.core.api.auth;

import co.airy.core.api.auth.controllers.UsersController;
import co.airy.core.api.auth.services.Mail;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.jwt.Jwt;
import co.airy.spring.test.WebTestHelper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;

import java.util.Map;

import static co.airy.test.Timing.retryOnException;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.annotation.DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureEmbeddedDatabase(beanName = "dataSource")
@SpringBootTest(classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@FlywayDataSource
@TestPropertySource(value = "classpath:test.properties")
@DirtiesContext(classMode = BEFORE_EACH_TEST_METHOD)
public class UsersControllerTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    private Jwt jwt;

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
    void canSignupAndLogin() throws Exception {
        final String firstName = "grace";
        final String email = "grace@example.com";
        final String password = "trustno1";

        final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"" + firstName + "\"," +
                "\"last_name\":\"hopper\",\"password\":\"" + password + "\"}";

        final String responseString = webTestHelper.post("/users.signup", signUpRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(nullValue())))
                .andReturn()
                .getResponse()
                .getContentAsString();

        webTestHelper.post("/users.signup", signUpRequest).andExpect(status().isUnauthorized());

        final JsonNode jsonNode = objectMapper.readTree(responseString);
        final String id = jsonNode.get("id").textValue();

        final String loginRequest = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";

        webTestHelper.post("/users.login", loginRequest)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(id)))
                .andExpect(jsonPath("$.first_name", equalTo(firstName)))
                .andExpect(jsonPath("$.token", not(nullValue())));

        final String loginRequestWrongPwd = "{\"email\":\"" + email + "\",\"password\":\"guess-i-should-have-trusted-a-password-manager\"}";

        webTestHelper.post("/users.login", loginRequestWrongPwd).andExpect(status().isUnauthorized());
    }

    @Test
    void canValidateSignup() throws Exception {
        final String firstName = "grace";
        final String email = "grace@example.com";
        final String password = "trustno1";

        final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"" + firstName + "\",\"password\":\"" + password + "\"}";

        webTestHelper.post("/users.signup", signUpRequest).andExpect(status().isBadRequest());
    }

    @Test
    void canResetPassword() throws Exception {
        final String email = "ada@example.com";

        final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"something\"," +
                "\"last_name\":\"hopper\",\"password\":\"trustno1\"}";

        webTestHelper.post("/users.signup", signUpRequest).andExpect(status().isOk());

        final String passwordResetRequest = "{\"email\":\"" + email + "\",\"password\":\"trustno1\"}";

        webTestHelper.post("/users.request-password-reset", passwordResetRequest)
                .andExpect(status().isNoContent());

        retryOnException(() -> Mockito.verify(mail).send(Mockito.eq(email), anyString(), anyString()),
                "could not send email");
    }

    @Test
    void canChangePassword() throws Exception {
        final String email = "ada-2@example.com";
        final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"something\"," +
                "\"last_name\":\"hopper\",\"password\":\"trustno1\"}";

        final String signupResponse = webTestHelper.post("/users.signup", signUpRequest)
                .andReturn().getResponse().getContentAsString();

        final JsonNode jsonNode = objectMapper.readTree(signupResponse);
        final String userId = jsonNode.get("id").textValue();

        final String requestPasswordRequest = "{\"email\":\"" + email + "\", \"password\":\"trustno1\"}";

        doNothing().when(mail).send(Mockito.eq(email), anyString(), anyString());

        webTestHelper.post("/users.request-password-reset", requestPasswordRequest)
                .andExpect(status().isNoContent());

        Map<String, Object> refreshClaim = Map.of("reset_pwd_for", userId);
        final String token = jwt.tokenFor(userId, refreshClaim);

        final String passwordResetRequest = "{\"token\":\"" + token + "\", \"new_password\": \"super-safe-password\"}";

        webTestHelper.post("/users.password-reset", passwordResetRequest).andExpect(status().isNoContent());
    }

    @Test
    void canListUsers() throws Exception {
        for (int i = 0; i < 5; i++) {
            final String firstName = "grace-" + i;
            final String email = "grace-" + i + "@example.com";
            final String password = "trustno1";

            final String signUpRequest = "{\"email\":\"" + email + "\",\"first_name\":\"" + firstName + "\"," +
                    "\"last_name\":\"hopper\",\"password\":\"" + password + "\"}";

            webTestHelper.post("/users.signup", signUpRequest).andExpect(status().isOk());
        }

        webTestHelper.post("/users.list", "{}", "user-1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(5)));
    }
}

