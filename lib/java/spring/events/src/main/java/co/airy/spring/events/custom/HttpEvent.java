package co.airy.spring.events.custom;

import org.springframework.context.ApplicationEvent;

import java.util.Map;

public class HttpEvent extends ApplicationEvent {
    private String body;
    private Map<String, String> headers;
    private String url;

    public HttpEvent(Object source, String body, Map<String, String> headers, String url) {
        super(source);
        this.body = body;
        this.headers = headers;
        this.url = url;
    }

    public String getBody() {
        return body;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public String getUrl() {
        return url;
    }
}
