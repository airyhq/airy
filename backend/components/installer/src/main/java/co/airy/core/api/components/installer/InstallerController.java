package co.airy.core.api.components.installer;

import co.airy.core.api.components.installer.CatalogHandler;
import co.airy.core.api.components.installer.InstallerHandler;
import co.airy.core.api.components.installer.payload.InstallPayload;
import co.airy.core.api.components.installer.payload.UninstallPayload;

import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import co.airy.log.AiryLoggerFactory;
import co.airy.core.api.components.installer.model.ComponentDetails;

@RestController
public class InstallerController {
    private static final Logger log = AiryLoggerFactory.getLogger(InstallerController.class);

    private final InstallerHandler intallerHandler;
    private final CatalogHandler catalogHandler;

    InstallerController(InstallerHandler intallerHandler, CatalogHandler catalogHandler) {
        this.intallerHandler = intallerHandler;
        this.catalogHandler = catalogHandler;
    }

    @PostMapping("/components.install")
    public ResponseEntity<?> installComponent(@RequestBody @Valid InstallPayload payload) {
        try {
            intallerHandler.installComponent(payload.getName());
        } catch(Exception e) {
            log.error("unable to perform install", e);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
    }

    @PostMapping("/components.uninstall")
    public ResponseEntity<?> uninstallComponent(@RequestBody @Valid UninstallPayload payload) {
        try {
            intallerHandler.uninstallComponent(payload.getName());
        } catch(Exception e) {
            log.error("unable to perform uninstall", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
    }

    @PostMapping("/components.list")
    public ResponseEntity<?> listComponents() {
        try {
            final List<ComponentDetails> components = catalogHandler.listComponents();
            return ResponseEntity.status(HttpStatus.OK).body(ComponentDetails.componentsDetailsListToMap(components));
        } catch(Exception e) {
            log.error("unable to perform list", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");
    }
}
