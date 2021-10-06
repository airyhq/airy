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
    private Map<String, String> properties;

    public TrackMessage.Builder getTrackMessage() {
        return getTrackMessage(new HashMap<>());
    }

    public TrackMessage.Builder getTrackMessage(Map<String, String> additionalProperties) {
        additionalProperties.putAll(properties);
        return TrackMessage.builder(eventName).properties(properties);
    }
}
