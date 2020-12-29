package co.airy.core.sources.google.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessagePayload {
    @JsonProperty("messageId")
    private String messageId;
    private String text;
    private Representative representative;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Representative {
        @JsonProperty("representativeType")
        private String representativeType;
    }
}
