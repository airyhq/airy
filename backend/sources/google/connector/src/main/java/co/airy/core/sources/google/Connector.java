package co.airy.core.sources.google;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.google.model.SendMessagePayload;
import co.airy.core.sources.google.model.SendMessageRequest;
import co.airy.core.sources.google.services.Api;
import co.airy.core.sources.google.services.Mapper;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static co.airy.avro.communication.MessageRepository.updateDeliveryState;

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

}
