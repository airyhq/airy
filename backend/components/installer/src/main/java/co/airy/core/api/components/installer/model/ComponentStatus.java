package co.airy.core.api.components.installer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComponentStatus {
    private String podName;
    private String componentName;
    private String expectedInstallationStatus;
    private String status;
}
