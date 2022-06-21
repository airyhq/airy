package co.airy.core.api.config;

import co.airy.core.api.config.dto.ComponentInfo;
import co.airy.core.api.config.dto.ServiceInfo;
import co.airy.core.api.config.payload.ServicesResponsePayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static java.util.stream.Collectors.toMap;

@Component
public class ServiceDiscovery {
    private final String namespace;
    private final RestTemplate restTemplate;
    private final HealthApi healthApi;

    private final Map<String, ServiceInfo> services = new ConcurrentHashMap<>();

    public ServiceDiscovery(@Value("${kubernetes.namespace}") String namespace, RestTemplate restTemplate, HealthApi healthApi) {
        this.namespace = namespace;
        this.restTemplate = restTemplate;
        this.healthApi = healthApi;
    }

    public Map<String, ServiceInfo> getServices() {
        return services;
    }

    public ComponentInfo getComponent(String componentName) {
        return getServices().values().stream()
                .filter((serviceInfo) -> serviceInfo.getComponent().equals(componentName))
                .reduce(null, (componentInfo, serviceInfo) -> {
                    componentInfo = Optional.ofNullable(componentInfo).orElse(new ComponentInfo(false, true));
                    componentInfo.setEnabled(serviceInfo.isEnabled());
                    // One unhealthy service means that the component is unhealthy
                    componentInfo.setHealthy(componentInfo.isHealthy() && serviceInfo.isHealthy());
                    return componentInfo;
                }, (v1, v2) -> {
                    v1.setHealthy(v1.isHealthy() && v2.isHealthy());
                    return v1;
                });
    }

    @Scheduled(fixedRate = 1_000)
    public void updateComponentsStatus() {
        final ResponseEntity<ServicesResponsePayload> response = restTemplate.getForEntity(String.format("http://airy-controller.%s/services", namespace),
                ServicesResponsePayload.class);

        final Map<String, ServiceInfo> newServices = response.getBody().getServices();
        // Start all requests in parallel
        final Map<String, Future<Boolean>> healthRequests = newServices
                .keySet().stream()
                .collect(toMap(serviceName -> serviceName, healthApi::isHealthy));

        healthRequests.forEach((serviceName, value) -> {
            Boolean healthResponse;
            try {
                healthResponse = value.get(30, TimeUnit.SECONDS);
            } catch (Exception e) {
                e.printStackTrace();
                healthResponse = false;
            }

            newServices.get(serviceName).setHealthy(healthResponse);
        });

        this.services.clear();
        this.services.putAll(newServices);
    }
}
