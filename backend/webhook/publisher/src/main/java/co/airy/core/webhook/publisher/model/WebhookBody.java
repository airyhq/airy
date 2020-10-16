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
    private String text;
    private Sender sender;
    private String sentAt;
    private String source;
    private Postback postback;

    @Data
    @AllArgsConstructor
    public static class Sender {
        String id;
    }
}
