package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.chat_plugin.payload.AuthenticationRequestPayload;
import co.airy.core.chat_plugin.payload.AuthenticationResponsePayload;
import co.airy.core.chat_plugin.payload.MessageResponsePayload;
import co.airy.core.chat_plugin.payload.SendMessageRequestPayload;
import co.airy.payload.response.RequestError;
import co.airy.spring.web.Jwt;
import co.airy.uuid.UUIDV5;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
public class ChatController {
    private final ObjectMapper objectMapper;
    private final Stores stores;
    private final Jwt jwt;

    public ChatController(Stores stores, Jwt jwt, ObjectMapper objectMapper) {
        this.stores = stores;
        this.jwt = jwt;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/chatplugin.authenticate")
    ResponseEntity<?> authenticateVisitor(@RequestBody @Valid AuthenticationRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId();
        final Channel channel = stores.getChannel(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

        final String userId = UUID.randomUUID().toString();
        Map<String, Object> sessionClaim = Map.of("session_id", userId, "channel_id", channelId);
        final String token = jwt.tokenFor(userId, sessionClaim);

        return ResponseEntity.ok(new AuthenticationResponsePayload(token));
    }

    @PostMapping("/chatplugin.send")
    ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload requestPayload) throws Exception {
        final String channelId = "channel id";
        final String sessionId = "session id";
        final Channel channel = stores.getChannel(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

        final String conversationId = UUIDV5.fromNamespaceAndName(channel.getId(), sessionId).toString();
        final Message message = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(channel.getId())
                .setContent(objectMapper.writeValueAsString(requestPayload.getMessage()))
                .setConversationId(conversationId)
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.DELIVERED)
                .setSource(channel.getSource())
                .setSenderId(sessionId)
                .setSenderType(SenderType.SOURCE_CONTACT)
                .setSentAt(Instant.now().toEpochMilli())
                .build();

        try {
            stores.sendMessage(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestError(e.getMessage()));
        }

        return ResponseEntity.ok(MessageResponsePayload.fromMessage(message));
    }
}
