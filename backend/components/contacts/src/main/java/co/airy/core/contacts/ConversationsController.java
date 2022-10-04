package co.airy.core.contacts;

import co.airy.core.contacts.payload.RecentMessagesRequestPayload;
import co.airy.model.contact.Contact;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class ConversationsController {
    private final Stores stores;

    public ConversationsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/contacts.recent-messages")
    public ResponseEntity<?> createContact(@RequestBody @Valid RecentMessagesRequestPayload payload) {
        final String contactId = payload.getContactId().toString();

        final Contact contact = stores.getContact(contactId);
        if (contact == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RequestErrorResponsePayload("Contact not found"));
        }
    }
}


