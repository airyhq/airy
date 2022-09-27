package co.airy.core.config.payload;

import co.airy.core.config.dto.ServiceInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServicesResponsePayload implements Serializable {
    private Map<String, ServiceInfo> services;
}
