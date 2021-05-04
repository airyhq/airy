package co.airy.spring.auth;

import co.airy.spring.core.AirySpringBootApplication;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "allowedOrigins=*",
}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class NoAuthTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void shouldNotAuthorize() throws Exception {
        mvc.perform(post("/data.get"))
                .andExpect(status().isOk());
    }
}
