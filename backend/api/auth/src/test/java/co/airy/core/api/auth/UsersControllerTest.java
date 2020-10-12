package co.airy.core.api.auth;

import co.airy.core.api.auth.dao.UserDAO;
import co.airy.core.api.auth.dto.User;
import co.airy.spring.core.AirySpringBootApplication;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

@AutoConfigureEmbeddedDatabase(beanName = "dataSource")
@SpringBootTest(properties = {
        "db.debug=true"
}, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@FlywayDataSource
public class UsersControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private UserDAO userDAO;

    @Test
    void userSignup() throws Exception {
        userDAO.insert(User.builder().id(UUID.randomUUID()).build());

        // TODO write signup api test
    }
}
