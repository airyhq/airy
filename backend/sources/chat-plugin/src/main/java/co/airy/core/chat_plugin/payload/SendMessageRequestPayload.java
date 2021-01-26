package co.airy.core.chat_plugin.payload;

import co.airy.mapping.model.Text;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
public class SendMessageRequestPayload {
    @NotNull
    private Text message;
}
