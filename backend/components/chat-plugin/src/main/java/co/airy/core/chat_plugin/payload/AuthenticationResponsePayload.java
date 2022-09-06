package co.airy.core.chat_plugin.payload;

import co.airy.model.message.dto.MessageResponsePayload;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponsePayload {
    private String token;
    private List<MessageResponsePayload> messages;
}
