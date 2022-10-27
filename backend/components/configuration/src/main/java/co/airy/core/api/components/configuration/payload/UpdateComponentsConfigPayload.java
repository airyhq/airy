package co.airy.core.api.components.configuration.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateComponentsConfigPayload {

    private List<Body> components;

    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Body {
        private String name;
        private boolean enabled;
        private Map<String, String> data;
    }
}
