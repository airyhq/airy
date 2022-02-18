package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.core.api.communication.service.SendMessageExecutorService;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.auth.PrincipalAccess;
import co.airy.uuid.UUIDv5;
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
import java.util.concurrent.*;

@RestController
public class SendMessageController {
    private final Stores stores;
    private final ObjectMapper objectMapper;
    private final PrincipalAccess principalAccess;
    private final KafkaProducer<String, Message> producer;
    private final SendMessageExecutorService sendMessageExecutorService;

    private final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();

    SendMessageController(Stores stores, ObjectMapper objectMapper, PrincipalAccess principalAccess, KafkaProducer<String, Message> producer, SendMessageExecutorService sendMessageExecutorService) {
        this.stores = stores;
        this.objectMapper = objectMapper;
        this.principalAccess = principalAccess;
        this.producer = producer;
        this.sendMessageExecutorService = sendMessageExecutorService;
    }

    @PostMapping("/messages.send")
    public ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload payload, Authentication auth) throws ExecutionException, InterruptedException, JsonProcessingException {
        Channel channel;
        String conversationId;

        if (payload.getConversationId() != null) {
            try {
                Conversation conversation;
                conversation = sendMessageExecutorService.getFutureCallableConversationAsync(stores, payload).get(5, TimeUnit.SECONDS);
                if (conversation == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
                conversationId = conversation.getId();
                channel = conversation.getChannel();
                if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            } catch (TimeoutException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            finally {
                sendMessageExecutorService.shutdown();
            }

        } else if (payload.getSourceRecipientId() != null && payload.getChannelId() != null) {
            // Create new conversation
            final ReadOnlyKeyValueStore<String, Channel> channelsStore = stores.getChannelsStore();
            channel = channelsStore.get(payload.getChannelId().toString());
            if (channel == null || channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            conversationId = UUIDv5.fromNamespaceAndName(channel.getSource(), payload.getSourceRecipientId()).toString();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        final String userId = principalAccess.getUserId(auth);

        final Message message = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(channel.getId())
                .setSourceRecipientId(payload.getSourceRecipientId())
                .setContent(objectMapper.writeValueAsString(payload.getMessage()))
                .setConversationId(conversationId)
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(channel.getSource())
                .setSenderId(userId)
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();

        producer.send(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message)).get();
        return ResponseEntity.ok(MessageResponsePayload.fromMessageContainer(new MessageContainer(message, new MetadataMap())));
    }
}