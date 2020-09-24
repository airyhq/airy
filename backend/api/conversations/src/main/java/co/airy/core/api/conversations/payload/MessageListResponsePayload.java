package co.airy.core.api.conversations.payload;

import co.airy.payload.response.MessageResponsePayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageListResponsePayload implements Serializable {
    private List<MessageResponsePayload> data;
    private ResponseMetadata responseMetadata;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseMetadata {
        private Long previousCursor;
        private Long nextCursor;
        private long total; // total message count
    }
}
