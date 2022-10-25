package co.airy.core.api.components.configuration.model;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
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

    private static final Pattern secretMatcher = Pattern.compile("(?i)secret|key|token|credentials|saFile");

    private String name;
    private Map<String, String> data;

    private static Map<String, String> maskSecrets(Map<String, String> data) {
        return data
            .entrySet()
            .stream()
            .map(e -> {
                if (secretMatcher.matcher(e.getKey()).find()) {
                    e.setValue("*********");
                }
                return e;
            })
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public static Map<String, Object> componentsConfigsListToMap(List<ComponentConfig> componentsConfigs) {
        final Map<String, Map<String, String>> cc = componentsConfigs
            .stream()
            .collect(Collectors.toMap(ComponentConfig::getName, v -> maskSecrets(v.getData())));
        return Map.of("components", cc);
    }
}
