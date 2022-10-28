package co.airy.core.api.components.configuration.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteComponentsConfigResponsePayload {

    private List<Body> components;
    
    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Body {
        private String name;
        private HttpStatus status;
        private String error;
    }
}
