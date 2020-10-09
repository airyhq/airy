package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountPayload implements Serializable {
    private String conversationId;
    private Integer unreadMessageCount;
    private String timestamp;
}
