package co.airy.core.sources.google;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.google.model.SendMessageRequest;
import co.airy.core.sources.google.services.Api;
import co.airy.core.sources.google.services.Mapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.filters.RequestLoggingIgnorePatterns;
import co.airy.tracking.RouteTracking;
import com.fasterxml.jackson.databind.JsonNode;
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

import static co.airy.model.message.MessageRepository.updateDeliveryState;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
public class Connector {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);

    private final long messageStaleAfterSec = 300L; // 5 minutes
    private final Api api;
    private final Mapper mapper;

    Connector(Api api, Mapper mapper) {
        this.api = api;
        this.mapper = mapper;
    }

    public List<KeyValue<String, SpecificRecordBase>> sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();

        if (isMessageStale(message)) {
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        if (sendMessageRequest.getSourceConversationId() == null) {
            // Cannot start conversation for Google
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        try {
            final JsonNode sendMessagePayload = mapper.fromSendMessageRequest(sendMessageRequest);
            api.sendMessage(sendMessageRequest.getSourceConversationId(), sendMessagePayload);

            updateDeliveryState(message, DeliveryState.DELIVERED);
            return List.of(KeyValue.pair(message.getId(), message));
        } catch (ApiException e) {
            log.error(String.format("Failed to send a message to Facebook \n SendMessageRequest: %s \n Api Exception: %s \n", sendMessageRequest, e.getMessage()), e);
            final Metadata error = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.ERROR, e.getMessage());
            final Metadata errorPayload = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ERROR, e.getErrorPayload());
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message),
                    KeyValue.pair(getId(error).toString(), errorPayload),
                    KeyValue.pair(getId(errorPayload).toString(), errorPayload)
                    );
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to Facebook \n SendMessageRequest: %s", sendMessageRequest), e);
            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.ERROR, e.getMessage());
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        }
    }

    private boolean isMessageStale(Message message) {
        return ChronoUnit.SECONDS.between(Instant.ofEpochMilli(message.getSentAt()), Instant.now()) > messageStaleAfterSec;
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/google");
    }

    @Bean
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of("/google"));
    }

    @Bean
    private RouteTracking routeTracking() {
        Pattern urlPattern = Pattern.compile(".*google\\.connect$");
        HashMap<String, String> properties = new HashMap<>(Map.of("channel", "google"));
        return new RouteTracking(urlPattern, "channel_connected", properties);
    }
}
