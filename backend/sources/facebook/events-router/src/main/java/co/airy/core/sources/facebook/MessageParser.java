package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.facebook.dto.Event;
import co.airy.model.metadata.MetadataKeys;
import co.airy.uuid.UUIDv5;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KeyValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

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

    public List<KeyValue<String, SpecificRecordBase>> getRecords(Event event) throws Exception {
        final String payload = event.getPayload();
        final JsonNode rootNode = objectMapper.readTree(payload);

        final JsonNode message = rootNode.get("message");
        final JsonNode postbackNode = rootNode.get("postback");

        final boolean isEcho = message != null && message.get("is_echo") != null && message.get("is_echo").asBoolean();
        final String appId = (message != null && message.get("app_id") != null && !message.get("app_id").isNull()) ? message.get("app_id").asText() : null;

        String senderId;

        final Map<String, String> headers = new HashMap<>();

        final Channel channel = event.getChannel();
        if (!isEcho) {
            senderId = getSourceConversationId(rootNode);
        } else if (appId != null && !appId.equals(this.facebookAppId)) {
            // Third party app
            senderId = appId;
        } else if (appId == null && !"instagram".equals(channel.getSource())) {
            // Sent by Facebook moderator via Facebook inbox
            senderId = getSourceConversationId(rootNode);
        } else {
            // Filter out echoes coming from this app
            return List.of();
        }

        if (rootNode.has("reaction")) {
            return getReaction(event.getConversationId(), rootNode);
        }

        if (message == null && postbackNode == null) {
            // not a message
            return List.of();
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

        // As a content hash use the Facebook message id if present and the whole content body if not
        final String contentId = Stream.of(message, postbackNode)
                .filter(Objects::nonNull)
                .findFirst()
                .map((node) -> node.get("mid"))
                .map(JsonNode::textValue)
                .orElse(payload);

        final String messageId = UUIDv5.fromNamespaceAndName(channel.getId(), contentId).toString();

        return List.of(KeyValue.pair(messageId, Message.newBuilder()
                .setSource(channel.getSource())
                .setDeliveryState(DeliveryState.DELIVERED)
                .setId(messageId)
                .setChannelId(channel.getId())
                .setConversationId(event.getConversationId())
                .setContent(payload)
                .setSenderId(senderId)
                .setIsFromContact(!isEcho)
                .setHeaders(headers)
                .setSentAt(rootNode.get("timestamp").asLong())
                .build()));
    }

    private List<KeyValue<String, SpecificRecordBase>> getReaction(String conversationId, JsonNode rootNode) throws Exception {
        final JsonNode reaction = rootNode.get("reaction");
        final String emojiString = emojiFromCodePoint(reaction.get("emoji").textValue());
        if (emojiString.equals("")) {
            throw new Exception(String.format("Could not convert reaction emoji \"%s\" to string.", emojiString));
        }

        final Metadata emoji = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Reaction.EMOJI, emojiString);
        final Metadata sentAt = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Reaction.EMOJI,
                String.valueOf(rootNode.get("timestamp").longValue()));

        return List.of(
                KeyValue.pair(getId(emoji).toString(), emoji),
                KeyValue.pair(getId(sentAt).toString(), sentAt)
        );
    }

    private final Pattern unicodePattern = Pattern.compile("^\\\\u\\{([0-9]*?)\\}");

    // E.g. "\\u{2764}\\u{FE0F}" -> ❤️
    private String emojiFromCodePoint(String facebookEmoji) {
        final String withoutBrackets = facebookEmoji.replaceAll("\\{", "").replaceAll("}", "");

        final StringBuilder builder = new StringBuilder();
        for (String code : withoutBrackets.split("\\\\u")) {
            if (code.equals("")) {
                continue;
            }
            final int codePoint = Integer.parseInt(code, 16);
            builder.appendCodePoint(codePoint);
        }

        return builder.toString();
    }
}
