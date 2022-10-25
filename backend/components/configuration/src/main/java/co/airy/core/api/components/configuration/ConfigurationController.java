package co.airy.core.api.components.configuration;

import java.util.List;

import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import co.airy.core.api.components.configuration.model.ComponentConfig;
import co.airy.log.AiryLoggerFactory;
import io.kubernetes.client.openapi.ApiException;

@RestController
public class ConfigurationController {
    private static final Logger log = AiryLoggerFactory.getLogger(ConfigurationController.class);

    private final ConfigurationHandler configurationHandler;

    ConfigurationController(ConfigurationHandler configurationHandler) {
        this.configurationHandler = configurationHandler;
    }

    @PostMapping("/components.config.update")
    public ResponseEntity<?> updateComponentsConfig() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/components.config.delete")
    public ResponseEntity<?> deleteComponentsConfig() {
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/components.config.get")
    public ResponseEntity<?> getComponentsConfig() {
        try {
            final List<ComponentConfig> componentsConfigs = configurationHandler.listComponentConfigs();
            return ResponseEntity.status(HttpStatus.OK).body(ComponentConfig.componentsConfigsListToMap(componentsConfigs));
        } catch(ApiException e) {
            log.error(String.format("unable to get configs (%s)", e.getResponseBody()), e);
        } catch(Exception e) {
            log.error("unable to get configs (%s)", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
