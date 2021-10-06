package co.airy.tracking;

import com.segment.analytics.messages.TrackMessage;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Data
@AllArgsConstructor
public class RouteTracking {
    private Pattern urlPattern;
    private String eventName;
    private String userId;
    private Map<String, String> properties;

    public RouteTracking(String userId, Pattern urlPattern, String eventName, Map<String, String> properties) {
        this.urlPattern = urlPattern;
        this.properties = properties;
        this.eventName = eventName;
        this.userId = userId;
    }

    public TrackMessage.Builder getTrackMessage() {
        return getTrackMessage(new HashMap<>());
    }

    public TrackMessage.Builder getTrackMessage(Map<String, String> additionalProperties) {
        additionalProperties.putAll(properties);
        return TrackMessage.builder(eventName).userId(userId).properties(properties);
    }
}
