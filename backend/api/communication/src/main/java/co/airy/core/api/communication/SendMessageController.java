package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.payload.response.EmptyResponsePayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@RestController
public class SendMessageController {
    private final Stores stores;
    private final ObjectMapper objectMapper;
    private final KafkaProducer<String, Message> producer;
    private final Mapper mapper;

    private final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();

    SendMessageController(Stores stores, ObjectMapper objectMapper, KafkaProducer<String, Message> producer, Mapper mapper) {
        this.stores = stores;
        this.objectMapper = objectMapper;
        this.producer = producer;
        this.mapper = mapper;
    }

    @PostMapping("/messages.send")
    public ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload payload, Authentication auth) throws ExecutionException, InterruptedException, JsonProcessingException {
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
                .setSenderId(auth.getPrincipal().toString())
                .setSenderType(SenderType.APP_USER)
                .setSentAt(Instant.now().toEpochMilli())
                .build();

        producer.send(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message)).get();

        return ResponseEntity.ok(mapper.fromMessage(message));
    }
}
