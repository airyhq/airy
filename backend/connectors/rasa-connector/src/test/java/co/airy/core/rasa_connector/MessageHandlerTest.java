package co.airy.core.rasa_connector;

import co.airy.spring.core.AirySpringBootApplication;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
@SpringBootTest(classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
class MessageHandlerTest {

}