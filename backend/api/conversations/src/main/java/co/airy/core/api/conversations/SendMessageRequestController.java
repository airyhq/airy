package co.airy.core.api.conversations;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.SendMessageRequestPayload;
import co.airy.core.api.conversations.payload.SendMessageResponsePayload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.payload.response.EmptyResponsePayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@RestController
public class SendMessageRequestController {

    @Autowired
    Stores stores;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaProducer<String, SpecificRecordBase> producer;

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload payload) throws ExecutionException, InterruptedException, JsonProcessingException {
        final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
        final Conversation conversation = conversationsStore.get(payload.getConversationId());

        if (conversation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new EmptyResponsePayload());
        }

        final Channel channel = conversation.getChannel();
        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new EmptyResponsePayload());
        }

        final Message message = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(channel.getId())
                .setContent(objectMapper.writeValueAsString(payload.getMessage()))
                .setConversationId(payload.getConversationId())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(channel.getSource())
                .setOffset(0L)
                .setSenderId(channel.getId())
                .setSenderType(SenderType.APP_USER)
                .setSentAt(Instant.now().toEpochMilli())
                .build();
        ProducerRecord record = new ProducerRecord<>(new ApplicationCommunicationMessages().name(), message.getId(), message);

        producer.send(record).get();

        return ResponseEntity.ok(new SendMessageResponsePayload(message.getId()));
    }
}
