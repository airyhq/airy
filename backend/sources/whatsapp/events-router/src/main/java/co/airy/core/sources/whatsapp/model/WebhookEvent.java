package co.airy.core.sources.whatsapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEvent {
    private String object;

    @JsonProperty("entry")
    private List<WebhookEntry> entries;
}
