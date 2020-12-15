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
public class Sender implements DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(Sender.class);
    private static final String appId = "sources.google.Sender";

    private final KafkaStreamsWrapper streams;
    private final Api api;
    private final Mapper mapper;

    Sender(KafkaStreamsWrapper streams, Api api, Mapper mapper) {
        this.streams = streams;
        this.api = api;
        this.mapper = mapper;
    }

    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> "google".equalsIgnoreCase(message.getSource()))
                .selectKey((messageId, message) -> message.getConversationId());

        final KTable<String, SendMessageRequest> contextTable = messageStream
                .groupByKey()
                .aggregate(SendMessageRequest::new,
                        (conversationId, message, aggregate) -> {
                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }
                            return aggregate;
                        });

        messageStream.filter((messageId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(contextTable, (message, sendMessageRequest) -> {
                    sendMessageRequest.setMessage(message);
                    return sendMessageRequest;
                })
                .mapValues(this::sendMessage)
                .to(new ApplicationCommunicationMessages().name());

        streams.start(builder.build(), appId);
    }

    private Message sendMessage(SendMessageRequest sendMessageRequest) {
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

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        startStream();
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
