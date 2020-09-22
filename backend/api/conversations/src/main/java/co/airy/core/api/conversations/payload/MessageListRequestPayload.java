package co.airy.core.api.conversations.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageListRequestPayload {
    @NotBlank
    private String conversationId;
    private Long cursor;
    private Long pageSize;
}
