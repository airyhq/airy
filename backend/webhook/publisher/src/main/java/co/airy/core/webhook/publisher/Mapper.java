package co.airy.core.webhook.publisher;

import co.airy.avro.communication.Message;
import co.airy.core.webhook.publisher.model.Postback;
import co.airy.core.webhook.publisher.model.WebhookBody;
import org.springframework.stereotype.Component;

import java.util.Map;

import static co.airy.date.format.DateFormat.isoFromMillis;

@Component
public class Mapper {
    public WebhookBody fromMessage(Message message) throws Exception {
        return WebhookBody.builder()
                .conversationId(message.getConversationId())
                .id(message.getId())
                .content(message.getContent())
                .source(message.getSource())
                .postback(buildPostback(message))
                .sentAt(isoFromMillis(message.getSentAt()))
                .sender(WebhookBody.Sender.builder()
                        .id(message.getSenderId())
                        .type(message.getSenderType().toString().toLowerCase())
                        .build())
                .build();
    }

    private Postback buildPostback(Message message) {
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
