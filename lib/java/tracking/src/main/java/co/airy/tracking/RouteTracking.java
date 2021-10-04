package co.airy.tracking;

import com.segment.analytics.messages.MessageBuilder;
import com.segment.analytics.messages.TrackMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.context.annotation.Bean;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.regex.Pattern;

@Data
@AllArgsConstructor
public class RouteTracking {
    private Pattern urlPattern;
    private MessageBuilder trackMessage;
    private Map<String,String> properties;

    public RouteTracking(String userId, Pattern urlPattern, String eventName, Map<String,String> properties) {
            this.urlPattern = urlPattern;
            this.properties = properties;
            this.trackMessage = TrackMessage.builder(eventName).userId(userId).properties(properties);
    }

    void addProperty(String key, String value) {
        this.getProperties().put(key, value);
    }
}
