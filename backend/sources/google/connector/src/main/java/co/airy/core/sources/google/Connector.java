package co.airy.core.sources.google;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.sources.google.model.SendMessagePayload;
import co.airy.core.sources.google.model.SendMessageRequest;
import co.airy.core.sources.google.services.Api;
import co.airy.core.sources.google.services.Mapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.IgnoreAuthPattern;
import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import static co.airy.model.message.MessageRepository.updateDeliveryState;

@Component
public class Connector {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);

    private final Api api;
    private final Mapper mapper;

    Connector(Api api, Mapper mapper) {
        this.api = api;
        this.mapper = mapper;
    }

    public Message sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();

        try {
            final SendMessagePayload sendMessagePayload = mapper.fromSendMessageRequest(sendMessageRequest);

            api.sendMessage(sendMessageRequest.getSourceConversationId(), sendMessagePayload);

            updateDeliveryState(message, DeliveryState.DELIVERED);
            return message;
        } catch (ApiException e) {
            log.error(String.format("Failed to send a message to Google \n SendMessageRequest: %s \n Error Message: %s \n", sendMessageRequest, e.getMessage()), e);
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to Google \n SendMessageRequest: %s", sendMessageRequest), e);
        }

        updateDeliveryState(message, DeliveryState.FAILED);
        return message;
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/google");
    }

}
