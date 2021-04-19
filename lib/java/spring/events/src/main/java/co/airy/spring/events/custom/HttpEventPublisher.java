package co.airy.spring.events.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class HttpEventPublisher {
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    @Async
    public void publishCustomEvent(final String body, final Map<String, String> headers, final String url) {
        HttpEvent httpEvent = new HttpEvent(this, body, headers, url);
        applicationEventPublisher.publishEvent(httpEvent);
    }
}