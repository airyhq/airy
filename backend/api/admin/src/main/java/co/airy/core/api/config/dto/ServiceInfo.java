package co.airy.core.api.config.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceInfo {
    private boolean enabled;
    private boolean healthy;
    private String component;
}
