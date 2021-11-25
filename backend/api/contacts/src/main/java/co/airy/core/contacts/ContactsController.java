package co.airy.core.contacts;

import co.airy.core.contacts.dto.Contact;
import co.airy.core.contacts.payload.ContactResponsePayload;
import co.airy.core.contacts.payload.CreateContactPayload;
import co.airy.core.contacts.payload.ListContactsRequestPayload;
import co.airy.core.contacts.payload.ListContactsResponsePayload;
import co.airy.core.contacts.payload.PaginationData;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@RestController
public class ContactsController implements HealthIndicator {
    private final Stores stores;

    public ContactsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/contacts.create")
    public ResponseEntity<?> createContact(@RequestBody @Valid CreateContactPayload payload) {
        final Contact newContact = Contact.builder()
                .id(UUID.randomUUID().toString())
                .createdAt(Instant.now().toEpochMilli())
                .metadata(payload.getMetadata())
                .address(payload.getAddress())
                .conversations(payload.getConversations())
                .displayName(payload.getDisplayName())
                .avatarUrl(payload.getAvatarUrl())
                .gender(payload.getGender())
                .locale(payload.getLocale())
                .organizationName(payload.getOrganizationName())
                .timezone(payload.getTimezone())
                .title(payload.getTitle())
                .via(payload.getVia())
                .build();

        try {
            stores.storeContact(newContact.toMetadata());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ContactResponsePayload.fromContact(newContact));
    }

    @PostMapping("/contacts.import")
    public ResponseEntity<?> importContacts() {
        // TODO import an array of contacts
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/contacts.list")
    public ResponseEntity<?> listContacts(@Valid @RequestBody(required = false) ListContactsRequestPayload payload) {
        payload = payload == null ? new ListContactsRequestPayload() : payload;
        final List<Contact> contacts = stores.getAllContacts();

        Paginator<Contact> paginator = new Paginator<>(contacts, Contact::getId)
                .perPage(payload.getPageSize()).from(payload.getCursor());

        Page<Contact> page = paginator.page();

        return ResponseEntity.ok(ListContactsResponsePayload.builder()
                .data(page.getData().stream().map(ContactResponsePayload::fromContact).collect(toList()))
                .paginationData(PaginationData.builder()
                        .nextCursor(page.getNextCursor())
                        .previousCursor(page.getPreviousCursor())
                        .total(contacts.size())
                        .build()).build()
        );
    }

    @PostMapping("/contacts.info")
    public ResponseEntity<?> contactInfo() {
        // TODO get a contact by id
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/contacts.update")
    public ResponseEntity<?> updateContact() {
        // TODO update contact, "" values indicate deletion
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/contacts.refetch")
    public ResponseEntity<?> refetchContact() {
        // TODO trigger sources to refetch contact information
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/contacts.merge")
    public ResponseEntity<?> mergeContact() {
        // TODO merge contact A into contact B. R
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/contacts.delete")
    public ResponseEntity<?> deleteContact() {
        // TODO delete contact
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @Override
    public Health health() {
        return Health.up().build();
    }
}


