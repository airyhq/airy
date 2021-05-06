package co.airy.spring.web.events;

import co.airy.spring.auth.session.UserProfile;
import org.springframework.context.ApplicationEvent;

import java.util.Map;

public class HttpEvent extends ApplicationEvent {
    private final String body;
    private final Map<String, String> headers;
    private final String url;
    private final UserProfile userProfile;

    public HttpEvent(Object source, String body, Map<String, String> headers, String url, UserProfile userProfile) {
        super(source);
        this.body = body;
        this.headers = headers;
        this.url = url;
        this.userProfile = userProfile;
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

    public UserProfile getUserProfile() {
        return userProfile;
    }
}
