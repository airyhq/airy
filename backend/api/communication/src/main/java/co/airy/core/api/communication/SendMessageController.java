package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.auth.PrincipalAccess;
import co.airy.uuid.UUIDv5;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@RestController
public class SendMessageController {
    private final Stores stores;
    private final ObjectMapper objectMapper;
    private final PrincipalAccess principalAccess;
    private final AsyncSendMessagesHandler asyncHanlder;

    SendMessageController(
            Stores stores,
            ObjectMapper objectMapper,
            PrincipalAccess principalAccess,
            AsyncSendMessagesHandler asyncHanlder) {

        this.stores = stores;
        this.objectMapper = objectMapper;
        this.principalAccess = principalAccess;
        this.asyncHanlder = asyncHanlder;
    }

    @PostMapping("/messages.send")
    public ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload payload, Authentication auth) throws ExecutionException, InterruptedException, JsonProcessingException {
        Channel channel = null;
        String conversationId = Optional.ofNullable(payload.getConversationId()).map((c) -> c.toString()).orElse(null);

        if (conversationId != null) {
            // Append message to existing conversation
            final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
            final Conversation conversation = conversationsStore.get(conversationId);
            if (conversation != null) {
                channel = conversation.getChannel();
                if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
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
        final String messageId = UUID.randomUUID().toString();
        final String channelId = Optional.ofNullable(channel).map((c) -> c.getId()).orElse(null);

        final Message message = Message.newBuilder()
                .setId(messageId)
                .setChannelId(channelId)
                .setSourceRecipientId(payload.getSourceRecipientId())
                .setContent(objectMapper.writeValueAsString(payload.getMessage()))
                .setConversationId(conversationId)
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(Optional.ofNullable(channel).orElseGet(Channel::new).getSource())
                .setSenderId(userId)
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();

        stores.storeMessage(message);

        // If there is no channelId it implies that the converstaion was not found
        // instally and it will be handled asynchronously
        HttpStatus s = HttpStatus.OK;
        if (channelId == null) {
            asyncHanlder.addPendingConversation(messageId, conversationId);
            s = HttpStatus.ACCEPTED;
        }
        return ResponseEntity.status(s).body(MessageResponsePayload.fromMessageContainer(new MessageContainer(message, new MetadataMap())));
    }
}
