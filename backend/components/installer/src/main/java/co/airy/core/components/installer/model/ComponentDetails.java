package co.airy.core.api.components.installer.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;


public class ComponentDetails {

    private final Map<String, Object> props = new HashMap<>();

    @JsonAnyGetter
    public Map<String, Object> getProps() {
        return props;
    }

    @JsonAnySetter
    public ComponentDetails add(String key, Object value) {
        props.put(key, value);

        return this;
    }

    public String getName() {
        return (String) props.getOrDefault("name", "");
    }

    public boolean isInstalled() {
        return (boolean) props.getOrDefault("installed", false);
    }

    public static Map<String, Object> componentsDetailsListToMap(List<ComponentDetails> componentsDetails) {
        final Map<String, Object> cm = componentsDetails
            .stream()
            .collect(Collectors.toMap(ComponentDetails::getName, ComponentDetails::getProps));
        return Map.of("components", cm);
    }
}
