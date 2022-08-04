package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Message;
import co.airy.core.sources.whatsapp.api.Api;
import co.airy.core.sources.whatsapp.dto.SendMessageRequest;
import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.filters.RequestLoggingIgnorePatterns;
import co.airy.tracking.RouteTracking;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Component
public class Connector {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);
    private final long messageStaleAfterSec = 300L; // 5 minutes
    private final Api api;

    Connector(Api api) {
        this.api = api;
    }

    public List<KeyValue<String, SpecificRecordBase>> sendMessage(SendMessageRequest sendMessageRequest) {
        // TODO
        return List.of();
    }

    private boolean isMessageStale(Message message) {
        return ChronoUnit.SECONDS.between(Instant.ofEpochMilli(message.getSentAt()), Instant.now()) > messageStaleAfterSec;
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/whatsapp");
    }

    @Bean
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of("/whatsapp"));
    }

    @Bean
    private RouteTracking routeTracking() {
        Pattern urlPattern = Pattern.compile(".*whatsapp\\.connect$");
        HashMap<String, String> properties = new HashMap<>(Map.of("channel", "whatsapp"));
        return new RouteTracking(urlPattern, "channel_connected", properties);
    }
}
