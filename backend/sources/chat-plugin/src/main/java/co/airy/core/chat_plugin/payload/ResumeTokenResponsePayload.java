package co.airy.core.chat_plugin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeTokenResponsePayload {
    private String resumeToken;
}
