package co.airy.core.chat_plugin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class RequestErrorResponsePayload implements Serializable {
    private String message;
}
