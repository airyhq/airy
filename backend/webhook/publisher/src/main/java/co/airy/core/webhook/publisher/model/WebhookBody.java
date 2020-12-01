package co.airy.core.webhook.publisher.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

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
    @Builder
    public static class Sender {
        private String id;
        private String type;
    }
}
