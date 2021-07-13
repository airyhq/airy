package co.airy.core.sources.google;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.sources.google.model.SendMessageRequest;
import co.airy.core.sources.google.services.Api;
import co.airy.core.sources.google.services.Mapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.filters.RequestLoggingIgnorePatterns;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static co.airy.model.message.MessageRepository.updateDeliveryState;

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

    public Message sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();

        if (isMessageStale(message)) {
            updateDeliveryState(message, DeliveryState.FAILED);
            return message;
        }

        try {
            final JsonNode sendMessagePayload = mapper.fromSendMessageRequest(sendMessageRequest);
            api.sendMessage(sendMessageRequest.getSourceConversationId(), sendMessagePayload);

            updateDeliveryState(message, DeliveryState.DELIVERED);
            return message;
        } catch (ApiException e) {
            log.error(String.format("Google Api Exception for SendMessageRequest:\n%s", sendMessageRequest), e);
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to Google \nSendMessageRequest: %s", sendMessageRequest), e);
        }

        updateDeliveryState(message, DeliveryState.FAILED);
        return message;
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
}
