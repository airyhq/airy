package co.airy.core.webhook.publisher;

import co.airy.avro.communication.Message;
import co.airy.core.webhook.publisher.model.Postback;
import co.airy.core.webhook.publisher.model.WebhookBody;
import co.airy.mapping.ContentMapper;
import org.springframework.stereotype.Component;

import java.util.Map;

import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

@Component
public class Mapper {
    private final ContentMapper contentMapper;

    Mapper(ContentMapper contentMapper) {
        this.contentMapper = contentMapper;
    }

    public WebhookBody fromMessage(Message message) throws Exception {
        contentMapper.render(message);

        return WebhookBody.builder()
                .conversationId(message.getConversationId())
                .id(message.getId())
                .text(message.getContent())
                .source(message.getSource())
                .postback(buildPostback(message))
                .sentAt(ISO_FROM_MILLIS(message.getSentAt()))
                .sender(new WebhookBody.Sender(message.getSenderId()))
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
