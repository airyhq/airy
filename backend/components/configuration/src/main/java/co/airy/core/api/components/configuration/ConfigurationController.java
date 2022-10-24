package co.airy.core.api.components.configuration;

import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import co.airy.log.AiryLoggerFactory;

@RestController
public class ConfigurationController {
    private static final Logger log = AiryLoggerFactory.getLogger(ConfigurationController.class);

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
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
