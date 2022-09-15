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

import co.airy.log.AiryLoggerFactory;

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
            log.error(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @PostMapping("/components.uninstall")
    public ResponseEntity<?> uninstallComponent(@RequestBody @Valid UninstallPayload payload) {
        try {
            intallerHandler.uninstallComponent(payload.getName());
        } catch(Exception e) {
            log.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @PostMapping("/components.list")
    public ResponseEntity<?> listComponents() {
        try {
            catalogHandler.listComponents();
        } catch(Exception e) {
            log.error(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.OK).body("");
    }
}
