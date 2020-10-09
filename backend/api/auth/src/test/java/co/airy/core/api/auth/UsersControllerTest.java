package co.airy.core.api.auth.config;

import co.airy.spring.core.AirySpringBootApplication;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureEmbeddedDatabase(beanName = "dataSource")
@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
public class UsersControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    void userSignup() throws Exception {
        throw new Error("TODO");
    }
}
