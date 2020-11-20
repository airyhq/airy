package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.twilio.model.SendMessageRequest;
import co.airy.core.sources.twilio.services.Api;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.mapping.ContentMapper;
import co.airy.mapping.model.Text;
import com.twilio.exception.ApiException;
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
    private static final String appId = "sources.twilio.Sender";

    private final KafkaStreamsWrapper streams;
    private final Api api;
    private final ContentMapper mapper;

    Sender(KafkaStreamsWrapper streams, Api api, ContentMapper mapper) {
        this.streams = streams;
        this.api = api;
        this.mapper = mapper;
    }

    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>table(new ApplicationCommunicationChannels().name())
                .filter((sourceChannelId, channel) -> channel.getSource().endsWith("twilio")
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> message.getSource().endsWith("twilio"))
                .selectKey((messageId, message) -> message.getConversationId());

        final KTable<String, SendMessageRequest> contextTable = messageStream
                .groupByKey()
                .aggregate(SendMessageRequest::new,
                        (conversationId, message, aggregate) -> {
                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }

                            aggregate.setChannelId(message.getChannelId());

                            return aggregate;
                        })
                .join(channelsTable, SendMessageRequest::getChannelId, (aggregate, channel) -> {
                    aggregate.setChannel(channel);
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
        final String from = sendMessageRequest.getChannel().getSourceChannelId();
        final String to = sendMessageRequest.getSourceConversationId();

        try {
            // TODO Figure out how we can let clients know which outbound message types are supported
            final Text content = (Text) mapper.render(message);
            api.sendMessage(from, to, content.getText());

            updateDeliveryState(message, DeliveryState.DELIVERED);
            return message;
        } catch (ApiException e) {
            log.error(String.format("Failed to send a message to Twilio \n SendMessageRequest: %s \n Error Message: %s \n", sendMessageRequest, e.getMessage()), e);
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to Twilio \n SendMessageRequest: %s", sendMessageRequest), e);
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
