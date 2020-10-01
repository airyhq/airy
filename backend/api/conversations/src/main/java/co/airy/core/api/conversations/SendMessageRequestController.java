package co.airy.core.api.conversations;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SendMessageRequest;
import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.SendMessageRequestPayload;
import co.airy.core.api.conversations.payload.SendMessageResponsePayload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceFacebookSendMessageRequests;
import co.airy.kafka.schema.source.SourceGoogleSendMessageRequests;
import co.airy.kafka.schema.source.SourceTwilioSendMessageRequests;
import co.airy.payload.response.EmptyResponsePayload;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.concurrent.ExecutionException;

@RestController
public class SendMessageRequestController {

    @Autowired
    Stores stores;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private KafkaProducer<String, SpecificRecordBase> producer;

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload payload) throws ExecutionException, InterruptedException {
        final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
        final Conversation conversation = conversationsStore.get(payload.getConversationId());

        if(conversation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new EmptyResponsePayload());
        }

        final Channel channel = conversation.getChannel();
        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new EmptyResponsePayload());
        }

        final Message message = messageMapper.fromPayload(payload.getConversationId(), payload.getText(), channel);

        if ("SELF".equalsIgnoreCase(channel.getSource())) {
            producer.send(new ProducerRecord<>(new ApplicationCommunicationMessages().name(), message.getId(), message)).get();
        } else {
            final SendMessageRequest sendMessageRequest = SendMessageRequest.newBuilder()
                    .setMessage(message)
                    .setToken(channel.getToken())
                    .setCreatedAt(message.getSentAt())
                    .build();
            ProducerRecord record = new ProducerRecord<>(resolveChannelConnectTopicName(channel.getSource()), message.getConversationId(), sendMessageRequest);

            producer.send(record).get();
        }

        return ResponseEntity.ok(new SendMessageResponsePayload(message.getId()));
    }

    private String resolveChannelConnectTopicName(String source) {
        switch (source) {
            case "GOOGLE":
                return new SourceGoogleSendMessageRequests().name();
            case "FACEBOOK":
                return new SourceFacebookSendMessageRequests().name();
            case "SMS_TWILIO":
            case "WHATSAPP_TWILIO":
                return new SourceTwilioSendMessageRequests().name();
            default:
                throw new IllegalArgumentException("Unknown source: " + source);
        }
    }
}
