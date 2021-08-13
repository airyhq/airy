package co.airy.core.api.admin.payload;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class WebhookResponsePayload {
    private String id;
    private String name;
    private String status;
    private String url;
    private Map<String, String> headers;
    private List<String> events;
}
