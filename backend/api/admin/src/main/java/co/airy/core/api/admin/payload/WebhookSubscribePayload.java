package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WebhookSubscribePayload {
    private UUID id;
    @NotNull
    private String url;
    private String name;
    private Map<String, String> headers = new HashMap<>();
    private List<String> events = new ArrayList<>();
    private String signatureKey;
}
