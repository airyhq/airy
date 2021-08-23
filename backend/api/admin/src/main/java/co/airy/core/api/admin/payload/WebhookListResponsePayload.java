package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookListResponsePayload {
    private List<WebhookResponsePayload> data;
}
