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
    public void add(String key, Object value) {
        props.put(key, value);
    }
}
