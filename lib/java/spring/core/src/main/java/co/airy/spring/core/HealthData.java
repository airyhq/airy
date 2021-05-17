package co.airy.spring.core;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class HealthData implements HealthIndicator {
    private final Health detailHealth;

    public HealthData(@Value("${componentName:#{null}}") String componentName) {
        if (componentName == null) {
            detailHealth = Health.up().build();
        } else {
            detailHealth = Health.up().withDetail("component_name", componentName).build();
        }
    }

    @Override
    public Health health() {
        return detailHealth;
    }
}
