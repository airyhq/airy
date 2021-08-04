package co.airy.core.sources.viber;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.sources.viber.dto.SendMessageRequest;
import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.filters.RequestLoggingIgnorePatterns;
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

    public Message sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();
        final String from = sendMessageRequest.getChannel().getSourceChannelId();
        final String to = sendMessageRequest.getSourceConversationId();

        if (isMessageStale(message)) {
            updateDeliveryState(message, DeliveryState.FAILED);
            return message;
        }

        try {
            //api.sendMessage(from, to, message.getContent());
            updateDeliveryState(message, DeliveryState.DELIVERED);
            return message;
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to viber \n SendMessageRequest: %s", sendMessageRequest), e);
        }

        updateDeliveryState(message, DeliveryState.FAILED);
        return message;
    }

    private boolean isMessageStale(Message message) {
        return ChronoUnit.SECONDS.between(Instant.ofEpochMilli(message.getSentAt()), Instant.now()) > messageStaleAfterSec;
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/viber");
    }

    @Bean
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of("/viber"));
    }
}
