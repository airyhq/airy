package co.airy.core.contacts;

import co.airy.avro.communication.Metadata;
import co.airy.core.contacts.dto.Contact;
import co.airy.core.contacts.payload.ContactInfoRequestPayload;
import co.airy.core.contacts.payload.ContactResponsePayload;
import co.airy.core.contacts.payload.CreateContactPayload;
import co.airy.core.contacts.payload.ListContactsRequestPayload;
import co.airy.core.contacts.payload.ListContactsResponsePayload;
import co.airy.core.contacts.payload.PaginationData;
import co.airy.core.contacts.payload.UpdateContactPayload;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;

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
    public ResponseEntity<?> importContacts(@RequestBody @Valid List<CreateContactPayload> payload) {
        List<Metadata> contactsMetadata = new ArrayList<Metadata>();
        List<ContactResponsePayload> createdContacts = new ArrayList<ContactResponsePayload>();

        payload.stream().forEach((p) -> {
            final Contact newContact = Contact.builder()
                    .id(UUID.randomUUID().toString())
                    .createdAt(Instant.now().toEpochMilli())
                    .metadata(p.getMetadata())
                    .address(p.getAddress())
                    .conversations(p.getConversations())
                    .displayName(p.getDisplayName())
                    .avatarUrl(p.getAvatarUrl())
                    .gender(p.getGender())
                    .locale(p.getLocale())
                    .organizationName(p.getOrganizationName())
                    .timezone(p.getTimezone())
                    .title(p.getTitle())
                    .via(p.getVia())
                    .build();
            contactsMetadata.addAll(newContact.toMetadata());
            createdContacts.add(ContactResponsePayload.fromContact(newContact));
        });

        try {
            stores.storeContact(contactsMetadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdContacts);
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
    public ResponseEntity<?> contactInfo(@RequestBody @Valid ContactInfoRequestPayload payload) {
        Contact contact;
        if (payload.getId() != null) {
            contact = stores.getContact(payload.getId());
        } else if (payload.getConversationId() != null) {
            contact = stores.getContactByConversationId(payload.getConversationId());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RequestErrorResponsePayload("Either contact or conversation id must be provided"));
        }

        if (contact == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RequestErrorResponsePayload("Contact not found"));
        }

        return ResponseEntity.ok(ContactResponsePayload.fromContact(contact));
    }

    @PostMapping("/contacts.update")
    public ResponseEntity<?> updateContact(@RequestBody @Valid UpdateContactPayload payload) {
        final String id = payload.getId().toString();
        final Contact contact = stores.getContact(id);
        if (contact == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RequestErrorResponsePayload("Contact not found"));
        }

        final Contact.Address address = Optional.ofNullable(contact.getAddress()).orElse(new Contact.Address());

        final Contact updatedContact = contact.toBuilder()
                .metadata(Optional.ofNullable(payload.getMetadata()).orElse(contact.getMetadata()))
                .address(Optional.ofNullable(payload.getAddress())
                        .map(address::merge)
                        .orElse(address))
                .conversations(Optional.ofNullable(payload.getConversations()).orElse(contact.getConversations()))
                .displayName(Optional.ofNullable(payload.getDisplayName()).orElse(contact.getDisplayName()))
                .avatarUrl(Optional.ofNullable(payload.getAvatarUrl()).orElse(contact.getAvatarUrl()))
                .gender(Optional.ofNullable(payload.getGender()).orElse(contact.getGender()))
                .locale(Optional.ofNullable(payload.getLocale()).orElse(contact.getLocale()))
                .organizationName(Optional.ofNullable(payload.getOrganizationName()).orElse(contact.getOrganizationName()))
                .timezone(Optional.ofNullable(payload.getTimezone()).orElse(contact.getTimezone()))
                .title(Optional.ofNullable(payload.getTitle()).orElse(contact.getTitle()))
                .via(Optional.ofNullable(payload.getVia()).orElse(contact.getVia()))
                .build();

        try {
            stores.storeContact(updatedContact.toMetadata());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
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


