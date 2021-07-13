package co.airy.core.sources.facebook;

import co.airy.avro.communication.Message;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class MessageParser {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private final String facebookAppId;

    MessageParser(@Value("${facebook.app-id}") String facebookAppId) {
        this.facebookAppId = facebookAppId;
    }

    String getSourceConversationId(final JsonNode webhookMessaging) throws NullPointerException {
        final JsonNode message = webhookMessaging.get("message");

        boolean isEcho = message != null && message.get("is_echo") != null && message.get("is_echo").asBoolean();

        return isEcho
                ? webhookMessaging.get("recipient").get("id").asText()
                : webhookMessaging.get("sender").get("id").asText();
    }

    public Message.Builder parse(final String payload, final String source) throws Exception {
        final JsonNode webhookMessaging = objectMapper.readTree(payload);

        final JsonNode message = webhookMessaging.get("message");
        final JsonNode postbackNode = webhookMessaging.get("postback");

        if (message == null && postbackNode == null) {
            throw new NotAMessageException();
        }

        final boolean isEcho = message != null && message.get("is_echo") != null && message.get("is_echo").asBoolean();
        final String appId = (message != null && message.get("app_id") != null && !message.get("app_id").isNull()) ? message.get("app_id").asText() : null;

        String senderId;

        final Map<String, String> headers = new HashMap<>();

        if (!isEcho) {
            senderId = getSourceConversationId(webhookMessaging);
        } else if (appId != null && !appId.equals(this.facebookAppId)) {
            // Third party app
            senderId = appId;
        } else if (appId == null && !source.equals("instagram")) {
            // Sent by Facebook moderator via Facebook inbox
            senderId = getSourceConversationId(webhookMessaging);
        } else {
            // Filter out echoes coming from this app
            throw new NotAMessageException();
        }

        if (postbackNode != null) {
            if (postbackNode.get("payload") != null) {
                headers.put("postback.payload", postbackNode.get("payload").textValue());
            } else {
                headers.put("postback.payload", "__empty__");
            }
        }

        Optional.ofNullable(postbackNode)
                .map(node -> node.get("referral"))
                .ifPresent(referralNode -> headers.put("postback.referral", referralNode.toString()));

        return Message.newBuilder()
                .setContent(payload)
                .setSenderId(senderId)
                .setIsFromContact(!isEcho)
                .setHeaders(headers)
                .setSentAt(webhookMessaging.get("timestamp").asLong());
    }
}
