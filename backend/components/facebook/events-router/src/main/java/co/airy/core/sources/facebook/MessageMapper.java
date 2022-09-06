package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.facebook.dto.Event;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import co.airy.uuid.UUIDv5;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Stream;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
public class MessageMapper {
    private static final Logger log = AiryLoggerFactory.getLogger(MessageMapper.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String facebookAppId;

    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();

    MessageMapper(@Value("${facebook.app-id}") String facebookAppId) {
        this.facebookAppId = facebookAppId;
    }

    String getSourceConversationId(final JsonNode webhookMessaging) throws NullPointerException {
        final JsonNode message = webhookMessaging.get("message");

        boolean isEcho = message != null && message.get("is_echo") != null && message.get("is_echo").asBoolean();

        return isEcho
                ? webhookMessaging.get("recipient").get("id").asText()
                : webhookMessaging.get("sender").get("id").asText();
    }

    public List<ProducerRecord<String, SpecificRecordBase>> getRecords(Event event, Function<String, Optional<String>> getMessageIdFn) throws Exception {
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
        } else if (appId == null) {
            // Sent by moderator via Facebook inbox
            senderId = getSourceConversationId(rootNode);
        } else {
            // Filter out echoes coming from this app
            return List.of();
        }


        final Function<String, Optional<String>> getMessageId = getMessageIdFunctor(getMessageIdFn, channel.getSource().equals("instagram") && isEcho);

        if (rootNode.has("reaction")) {
            // In case that this is an existing message, try retrieving its id
            final String facebookMessageId = rootNode.get("reaction").get("mid").textValue();
            final String messageId = getMessageId.apply(facebookMessageId)
                    .orElseGet(() -> UUIDv5.fromNamespaceAndName(channel.getId(), facebookMessageId).toString());
            return getReaction(messageId, rootNode);
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
        final Optional<String> facebookMessageId = Stream.of(message, postbackNode)
                .filter(Objects::nonNull)
                .findFirst()
                .map((node) -> node.get("mid"))
                .map(JsonNode::textValue);

        final String messageId = facebookMessageId.flatMap(getMessageId)
                .orElseGet(() -> UUIDv5.fromNamespaceAndName(channel.getId(), payload).toString());

        return List.of(new ProducerRecord<>(applicationCommunicationMessages, messageId, Message.newBuilder()
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

    // Instagram does not send an app id in its echoes. Therefore, we use the metadata Facebook mid for de-duplication
    // The Facebook echo however can arrive before the metadata record is even written to the metadata topic
    // Therefore we implement a retry mechanism only for Instagram echoes
    // See: https://github.com/airyhq/airy/issues/2434
    private Function<String, Optional<String>> getMessageIdFunctor(Function<String, Optional<String>> getMessageId, boolean isInstagramEcho) {
        if (!isInstagramEcho) {
            return getMessageId;
        }

        return (String facebookMessagId) -> {
            for (int i = 3; i > 0; i--) {
                final Optional<String> maybeMessagId = getMessageId.apply(facebookMessagId);
                if (maybeMessagId.isPresent()) {
                    return maybeMessagId;
                }
                try {
                    TimeUnit.MILLISECONDS.sleep((4 - i) * 500L); // wait 0.5, 1.0, 1.5, 2.0 seconds
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            return getMessageId.apply(facebookMessagId);
        };
    }

    private List<ProducerRecord<String, SpecificRecordBase>> getReaction(String messageId, JsonNode rootNode) throws Exception {
        final JsonNode reaction = rootNode.get("reaction");

        if (!reaction.get("action").textValue().equals("react")) {
            // unreact
            return List.of(
                    new ProducerRecord<>(applicationCommunicationMetadata, getId(new Subject("message", messageId), MetadataKeys.MessageKeys.Reaction.EMOJI).toString(), null),
                    new ProducerRecord<>(applicationCommunicationMetadata, getId(new Subject("message", messageId), MetadataKeys.MessageKeys.Reaction.SENT_AT).toString(), null)
            );
        }

        final String emojiString = emojiFromCodePoint(reaction.get("emoji").textValue());
        if (emojiString.equals("")) {
            throw new Exception(String.format("Could not convert reaction emoji \"%s\" to string.", emojiString));
        }

        Metadata emoji = newMessageMetadata(messageId, MetadataKeys.MessageKeys.Reaction.EMOJI, emojiString);

        final Metadata sentAt = newMessageMetadata(messageId, MetadataKeys.MessageKeys.Reaction.SENT_AT,
                String.valueOf(rootNode.get("timestamp").longValue()));

        return List.of(
                new ProducerRecord<>(applicationCommunicationMetadata, getId(emoji).toString(), emoji),
                new ProducerRecord<>(applicationCommunicationMetadata, getId(sentAt).toString(), sentAt)
        );
    }

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
