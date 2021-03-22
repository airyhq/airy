package co.airy.core.api.admin.payload;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class GetWebhookResponse {
    private String status;
    private String url;
    private Map<String, String> headers;
}
