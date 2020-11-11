package co.airy.core.sources.google;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class MessageParser {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isMessage(final String payload) {
        try {
            final GooglePayload event = objectMapper.readValue(payload, GooglePayload.class);
            return event.getMessage() != null;
        } catch (Exception e) {
            // TODO log
            return false;
        }
    }
}
