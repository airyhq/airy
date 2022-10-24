package co.airy.core.api.components.configuration.model;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponentsInstalled {

    private Map<String, Details> components;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Details {
        private boolean installed;
        private String name;
    }
 }
