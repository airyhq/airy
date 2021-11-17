package co.airy.core.contacts;

import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContactsController implements HealthIndicator {
    private static final Logger log = AiryLoggerFactory.getLogger(ContactsController.class);

    @PostMapping(value = {"/contacts.create"})
    public ResponseEntity<?> createContact() {
        // TODO create contact
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.import"})
    public ResponseEntity<?> importContacts() {
        // TODO import an array of contact contacts
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.list"})
    public ResponseEntity<?> listContacts() {
        // TODO paginated list all contacts
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.info"})
    public ResponseEntity<?> contactInfo() {
        // TODO get a contact by id
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.update"})
    public ResponseEntity<?> updateContact() {
        // TODO update contact, "" values indicate deletion
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.refetch"})
    public ResponseEntity<?> refetchContact() {
        // TODO trigger sources to refetch contact information
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.merge"})
    public ResponseEntity<?> mergeContact() {
        // TODO merge contact A into contact B. R
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping(value = {"/contacts.delete"})
    public ResponseEntity<?> deleteContact() {
        // TODO delete contact
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @Override
    public Health health() {
        return Health.up().build();
    }
}


