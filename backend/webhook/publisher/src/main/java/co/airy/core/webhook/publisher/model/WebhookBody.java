package co.airy.core.webhook.publisher.model;

import co.airy.avro.communication.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;

import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;
import static co.airy.payload.format.DateFormat.ISO_INSTANT_WITH_MILLIS_DF;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookBody implements Serializable {
    private String conversationId;
    private String id;
    private String content;
    private Sender sender;
    private String sentAt;
    private String source;
    private Postback postback;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public static WebhookBody fromMessage(Message message) {
        return WebhookBody.builder()
            .conversationId(message.getConversationId())
            .id(message.getId())
            .content(message.getContent())
            .source(message.getSource())
            .postback(buildPostback(message))
            .sentAt(ISO_FROM_MILLIS(message.getSentAt()))
            .sender(new Sender(message.getSenderId()))
            .build();
    }

    @Data
    @AllArgsConstructor
    private static class Sender {
        String id;
    }

    private static Postback buildPostback(Message message) {
        final Map<String, String> headers = message.getHeaders();

        if (headers == null || headers.isEmpty()) {
            return null;
        }

        return Postback.builder()
            .payload(headers.get("postback.payload"))
            .referral(headers.get("postback.referral"))
            .type(headers.get("postback.type"))
            .build();
    }
}
