package co.airy.core.chat_plugin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.chat_plugin.config.Jwt;
import co.airy.core.chat_plugin.payload.AuthenticationRequestPayload;
import co.airy.core.chat_plugin.payload.AuthenticationResponsePayload;
import co.airy.core.chat_plugin.payload.ResumeTokenRequestPayload;
import co.airy.core.chat_plugin.payload.ResumeTokenResponsePayload;
import co.airy.core.chat_plugin.payload.SendMessageRequestPayload;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static co.airy.spring.web.Headers.getAuthToken;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class ChatController {
    private final ObjectMapper objectMapper;
    private final Stores stores;
    private final Jwt jwt;
    private final String apiToken;

    public ChatController(Stores stores, Jwt jwt, ObjectMapper objectMapper, @Value("${systemToken:#{null}}") String apiToken) {
        this.stores = stores;
        this.jwt = jwt;
        this.objectMapper = objectMapper;
        this.apiToken = apiToken;
    }

    @PostMapping("/chatplugin.authenticate")
    ResponseEntity<?> authenticateVisitor(@RequestBody @Valid AuthenticationRequestPayload requestPayload) {
        final UUID channelId = requestPayload.getChannelId();
        final String resumeToken = requestPayload.getResumeToken();

        Principal principal;
        List<Message> messages = List.of();
        if (resumeToken != null) {
            principal = resumeConversation(resumeToken);
            messages = stores.getMessages(principal.getConversationId());
        } else if (channelId != null) {
            principal = createConversation(channelId.toString());
        } else {
            return ResponseEntity.badRequest().build();
        }

        final String authToken = jwt.getAuthToken(principal.getConversationId(), principal.getChannelId());

        return ResponseEntity.ok(new AuthenticationResponsePayload(authToken,
                messages.stream().map(MessageResponsePayload::fromMessage).collect(Collectors.toList())));
    }

    private Principal resumeConversation(String resumeToken) {
        return jwt.authenticateResume(resumeToken);
    }

    private Principal createConversation(String channelId) {
        final Channel channel = stores.getChannel(channelId);

        if (channel == null) {
            throw new ResponseStatusException(NOT_FOUND);
        }

        final String conversationId = UUID.randomUUID().toString();
        return new Principal(channelId, conversationId);
    }

    @PostMapping("/chatplugin.resumeToken")
    ResponseEntity<ResumeTokenResponsePayload> getResumeToken(
            @Valid @RequestBody(required = false) ResumeTokenRequestPayload requestPayload,
            @RequestHeader(value = "Authorization") String authHeader) {
        final Principal principal = getUserOrSystemPrincipal(requestPayload, authHeader);
        final String resumeToken = jwt.getResumeToken(principal.getConversationId(), principal.getChannelId());
        return ResponseEntity.ok(new ResumeTokenResponsePayload(resumeToken));
    }

    private Principal getUserOrSystemPrincipal(ResumeTokenRequestPayload requestPayload, String authHeader) {
        final String requestToken = getAuthToken(authHeader);
        if (apiToken != null && apiToken.equals(requestToken)) {
            if (requestPayload == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            }
            return new Principal(requestPayload.getChannelId(), requestPayload.getConversationId());
        }

        return jwt.authenticate(requestToken);
    }

    @PostMapping("/chatplugin.send")
    ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload requestPayload, Authentication authentication) {
        final Principal principal = (Principal) authentication.getPrincipal();
        final String channelId = principal.getChannelId();
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
                    .setSenderId(principal.getConversationId())
                    .setSentAt(Instant.now().toEpochMilli())
                    .setIsFromContact(true)
                    .build();

            stores.sendMessage(message);
            return ResponseEntity.ok(MessageResponsePayload.fromMessage(message));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }
    }
}
