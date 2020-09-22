package co.airy.core.sources.facebook.model;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.util.List;

@Data
public class WebhookEntry {
    private String id;
    private List<JsonNode> messaging;
    private List<JsonNode> standby;
}
