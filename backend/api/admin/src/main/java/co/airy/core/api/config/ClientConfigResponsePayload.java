package co.airy.core.api.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientConfigResponsePayload {
    private Set<ComponentResponsePayload> components;
}
