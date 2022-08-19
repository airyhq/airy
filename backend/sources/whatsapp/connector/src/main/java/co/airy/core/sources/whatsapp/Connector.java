package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.api.Api;
import co.airy.core.sources.whatsapp.api.ApiException;
import co.airy.core.sources.whatsapp.api.model.SendMessageResponse;
import co.airy.core.sources.whatsapp.dto.Conversation;
import co.airy.core.sources.whatsapp.dto.SendMessageRequest;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
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
import java.util.ArrayList;
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

    Connector(Api api) {
        this.api = api;
    }

    public List<KeyValue<String, SpecificRecordBase>> sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();
        final Conversation conversation = sendMessageRequest.getConversation();

        if (isMessageStale(message)) {
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        if (sendMessageRequest.getConversation().getSourceConversationId() == null) {
            // Cannot initiate a conversation for Whatsapp as a business
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        try {
            final SendMessageResponse response = api.sendMessage(sendMessageRequest);
            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ID, response.getMessageId());
            updateDeliveryState(message, DeliveryState.DELIVERED);

            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        } catch (ApiException e) {
            log.error(String.format("Failed to send a \n SendMessageRequest: %s \n Api Exception: %s \n", sendMessageRequest, e.getMessage()), e);
            final ArrayList<KeyValue<String, SpecificRecordBase>> results = new ArrayList<>();
            final Metadata error = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.ERROR, e.getMessage());
            results.add(KeyValue.pair(getId(error).toString(), error));

            if (e.getErrorPayload() != null) {
                final Metadata errorPayload = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ERROR, e.getErrorPayload());
                results.add(KeyValue.pair(getId(errorPayload).toString(), errorPayload));
            }
            updateDeliveryState(message, DeliveryState.FAILED);
            return results;
        } catch (Exception e) {
            log.error(String.format("Failed to send a \n SendMessageRequest: %s", sendMessageRequest), e);
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
