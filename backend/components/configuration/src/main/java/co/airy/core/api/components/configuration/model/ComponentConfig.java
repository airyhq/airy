package co.airy.core.api.components.configuration.model;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComponentConfig {

    private String name;
    private Map<String, String> data;

    public static Map<String, Object> componentsConfigsListToMap(List<ComponentConfig> componentsConfigs) {
        final Map<String, Map<String, String>> cc = componentsConfigs
            .stream()
            .collect(Collectors.toMap(ComponentConfig::getName, ComponentConfig::getData));
        return Map.of("components", cc);
    }
}
