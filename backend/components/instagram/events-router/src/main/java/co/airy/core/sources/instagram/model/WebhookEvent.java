package co.airy.core.sources.facebook.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class WebhookEvent {
    @JsonProperty("entry")
    private List<WebhookEntry> entries;
}
