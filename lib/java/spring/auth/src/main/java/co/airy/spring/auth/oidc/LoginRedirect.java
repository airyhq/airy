package co.airy.spring.auth.oidc;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@ConditionalOnBean(ClientRegistrationRepository.class)
public class LoginRedirect {
    private final String registrationId;
    public LoginRedirect(ConfigProvider config) {
        this.registrationId = config.getRegistration().getRegistrationId();
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public void loginRedirect(HttpServletResponse response) throws IOException {
        response.sendRedirect(String.format("/oauth2/authorization/%s", registrationId));
    }
}
