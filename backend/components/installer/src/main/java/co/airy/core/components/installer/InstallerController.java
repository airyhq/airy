package co.airy.core.api.components.installer;

import co.airy.core.api.components.installer.payload.InstallPayload;
import co.airy.core.api.components.installer.payload.UninstallPayload;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;

@RestController
public class InstallerController {

    private final InstallerHandler handler;

    InstallerController(InstallerHandler handler) {
        this.handler = handler;
    }

    @PostMapping("/components.install")
    public ResponseEntity<?> installComponent(@RequestBody @Valid InstallPayload payload) {
        try {
            handler.installComponent(payload.getName());
        } catch(Exception e) {}

        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @PostMapping("/components.uninstall")
    public ResponseEntity<?> uninstallComponent(@RequestBody @Valid UninstallPayload payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @PostMapping("/components.list")
    public ResponseEntity<?> listComponents() {
        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }
}
