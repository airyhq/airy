package co.airy.core.api.components.installer.model;

import java.util.HashMap;
import java.util.Map;

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
}
