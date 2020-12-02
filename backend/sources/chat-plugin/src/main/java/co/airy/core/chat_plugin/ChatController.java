package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import co.airy.core.chat_plugin.config.Jwt;
import co.airy.core.chat_plugin.payload.AuthenticationRequestPayload;
import co.airy.core.chat_plugin.payload.AuthenticationResponsePayload;
import co.airy.core.chat_plugin.payload.SendMessageRequestPayload;
import co.airy.payload.response.RequestErrorResponsePayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

@RestController
public class ChatController {
    private final ObjectMapper objectMapper;
    private final Stores stores;
    private final Jwt jwt;
    private final Mapper mapper;

    public ChatController(Stores stores, Jwt jwt, ObjectMapper objectMapper, Mapper mapper) {
        this.stores = stores;
        this.jwt = jwt;
        this.objectMapper = objectMapper;
        this.mapper = mapper;
    }

    @PostMapping("/chatplugin.authenticate")
    ResponseEntity<AuthenticationResponsePayload> authenticateVisitor(@RequestBody @Valid AuthenticationRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();
        final Channel channel = stores.getChannel(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

        final String sessionId = UUID.randomUUID().toString();
        final String token = jwt.tokenFor(sessionId, channelId);

        return ResponseEntity.ok(new AuthenticationResponsePayload(token));
    }

    @PostMapping("/chatplugin.send")
    ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload requestPayload, Authentication authentication) {
        final Principal principal = (Principal) authentication.getPrincipal();
        final String channelId = principal.getChannelId();
        final String sessionId = principal.getSessionId();
        final Channel channel = stores.getChannel(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            final Message message = Message.newBuilder()
                    .setId(UUID.randomUUID().toString())
                    .setChannelId(channel.getId())
                    .setContent(objectMapper.writeValueAsString(requestPayload.getMessage()))
                    .setConversationId(principal.getName())
                    .setHeaders(Map.of())
                    .setDeliveryState(DeliveryState.DELIVERED)
                    .setSource(channel.getSource())
                    .setSenderId(sessionId)
                    .setSenderType(SenderType.SOURCE_CONTACT)
                    .setSentAt(Instant.now().toEpochMilli())
                    .build();

            stores.sendMessage(message);
            return ResponseEntity.ok(mapper.fromMessage(message));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
    }
}
