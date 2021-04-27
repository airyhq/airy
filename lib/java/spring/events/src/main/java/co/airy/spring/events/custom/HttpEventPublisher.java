package co.airy.spring.events.custom;

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
    public void publishCustomEvent(final String body, final Map<String, String> headers, final String url) {
        HttpEvent httpEvent = new HttpEvent(this, body, headers, url);
        applicationEventPublisher.publishEvent(httpEvent);
    }
}