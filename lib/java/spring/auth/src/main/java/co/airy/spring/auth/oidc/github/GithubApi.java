package co.airy.spring.auth.oidc.github;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ApplicationListener;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Collections;
import java.util.List;

@Component
public class GithubApi implements ApplicationListener<ApplicationReadyEvent> {
    private RestTemplate restTemplate;
    private final RestTemplateBuilder restTemplateBuilder;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final URI githubEmailUri = URI.create("https://api.github.com/user/emails");

    public GithubApi(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplateBuilder = restTemplateBuilder;
    }

    public List<EmailsResponse> getUserEmails(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(accessToken);

        RequestEntity<List<EmailsResponse>> request = new RequestEntity<>(headers, HttpMethod.GET, githubEmailUri);
        ResponseEntity<List<EmailsResponse>> response = restTemplate.exchange(request, new ParameterizedTypeReference<List<EmailsResponse>>() {
        });
        return response.getBody();
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        restTemplate = restTemplateBuilder
                .additionalMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }
}
