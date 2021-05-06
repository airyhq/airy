package co.airy.spring.web.events;

import co.airy.spring.auth.session.UserProfile;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class HttpEventPublisher {
    private final ApplicationEventPublisher applicationEventPublisher;

    public HttpEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @Async
    public void publishCustomEvent(final String body, final Map<String, String> headers, final String url, UserProfile userProfile) {
        HttpEvent httpEvent = new HttpEvent(this, body, headers, url, userProfile);
        applicationEventPublisher.publishEvent(httpEvent);
    }
}
