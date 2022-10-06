package co.airy.core.contacts;

import co.airy.avro.communication.Message;
import co.airy.core.contacts.payload.PaginationData;
import co.airy.core.contacts.payload.RecentMessagesRequestPayload;
import co.airy.core.contacts.payload.RecentMessagesResponsePayload;
import co.airy.model.contact.Contact;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@RestController
public class ConversationsController {
    private final Stores stores;

    public ConversationsController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/contacts.recent-messages")
    public ResponseEntity<?> recentMessages(@RequestBody @Valid RecentMessagesRequestPayload payload) {
        final String contactId = payload.getContactId().toString();

        final Contact contact = stores.getContact(contactId);
        if (contact == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new RequestErrorResponsePayload("Contact not found"));
        }

        final Map<UUID, String> cursors = payload.getCursors();
        final int pageSize = payload.getPageSize();
        final List<String> includeSources = payload.getIncludeSources();
        Map<String, RecentMessagesResponsePayload> response = new HashMap<>();
        for (Map.Entry<UUID, String> entry : contact.getConversations().entrySet()) {
            // Skip sources not included in the filter list
            if (!includeSources.isEmpty() && !includeSources.contains(entry.getValue())) {
                continue;
            }

            try {
                final UUID conversationId = entry.getKey();
                final RecentMessagesResponsePayload messages = fetchMessages(conversationId.toString(), pageSize, cursors.get(conversationId));
                response.put(conversationId.toString(), messages);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    private RecentMessagesResponsePayload fetchMessages(String conversationId, int pageSize, String cursor) {
        final List<Message> messages = stores.getMessages(conversationId);
        if (messages == null) {
            return null;
        }

        Paginator<Message> paginator = new Paginator<>(messages, Message::getId).perPage(pageSize).from(cursor);

        Page<Message> page = paginator.page();

        return RecentMessagesResponsePayload.builder().data(page.getData().stream().map(MessageResponsePayload::fromMessage).collect(toList())).paginationData(PaginationData.builder().nextCursor(page.getNextCursor()).previousCursor(cursor).total(messages.size()).build()).build();
    }
}


