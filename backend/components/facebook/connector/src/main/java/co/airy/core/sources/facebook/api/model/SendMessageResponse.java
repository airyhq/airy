package co.airy.core.sources.facebook.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageResponse {
    @JsonProperty("recipient_id")
    private String recipientId;
    @JsonProperty("message_id")
    private String messageId;
}
