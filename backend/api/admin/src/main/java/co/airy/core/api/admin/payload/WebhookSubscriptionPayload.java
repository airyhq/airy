package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WebhookSubscriptionPayload {
    private Map<String, String> headers;
    private String url;
}
