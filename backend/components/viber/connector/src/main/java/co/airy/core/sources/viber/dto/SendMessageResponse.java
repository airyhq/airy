package co.airy.core.sources.viber.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageResponse {
    private Integer status;
    private String statusMessage;
    private Long messageToken;
}
