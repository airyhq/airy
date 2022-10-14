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
import io.kubernetes.client.openapi.ApiException;
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
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch(ApiException e) {
            log.error(String.format("unable to perform install (%s)", e.getResponseBody()), e);
        } catch(Exception e) {
            log.error("unable to perform install", e);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/components.uninstall")
    public ResponseEntity<?> uninstallComponent(@RequestBody @Valid UninstallPayload payload) {
        try {
            intallerHandler.uninstallComponent(payload.getName());
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch(ApiException e) {
            log.error(String.format("unable to perform uninstall (%s)", e.getResponseBody()), e);
        } catch(Exception e) {
            log.error("unable to perform uninstall", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/components.list")
    public ResponseEntity<?> listComponents() {
        try {
            final List<ComponentDetails> components = catalogHandler.listComponents();
            return ResponseEntity.status(HttpStatus.OK).body(ComponentDetails.componentsDetailsListToMap(components));
        } catch(ApiException e) {
            log.error(String.format("unable to perform list (%s)", e.getResponseBody()), e);
        } catch(Exception e) {
            log.error("unable to perform list", e);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
