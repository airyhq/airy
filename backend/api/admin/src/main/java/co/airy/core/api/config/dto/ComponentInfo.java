package co.airy.core.api.config.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponentInfo {
    private boolean enabled;
    private boolean healthy;
}
