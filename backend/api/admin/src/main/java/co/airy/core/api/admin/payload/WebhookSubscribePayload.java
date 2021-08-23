package co.airy.core.api.admin.payload;

import co.airy.model.event.payload.EventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookSubscribePayload {
    private UUID id;
    @NotNull
    private URI url;
    private Map<String, String> headers = new HashMap<>();
    private List<EventType> events = new ArrayList<>();
    private String signatureKey;
}
