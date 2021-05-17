package co.airy.core.api.config;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
class HealthResponse {
    private boolean enabled;
    private boolean healthy;
    private String component;
}
