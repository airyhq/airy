package co.airy.core.api.communication;

import co.airy.core.api.communication.payload.MessageListRequestPayload;
import co.airy.core.api.communication.payload.MessageListResponsePayload;
import co.airy.core.api.communication.payload.PaginationData;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@RestController
public class MessagesController {
    private final Stores stores;

    MessagesController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/messages.list")
    ResponseEntity<MessageListResponsePayload> messageList(@RequestBody @Valid MessageListRequestPayload messageListRequestPayload) {
        final String conversationId = messageListRequestPayload.getConversationId().toString();
        final int pageSize = Optional.ofNullable(messageListRequestPayload.getPageSize()).orElse(20);

        MessageListResponsePayload response = fetchMessages(conversationId, pageSize, messageListRequestPayload.getCursor());

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }

    private MessageListResponsePayload fetchMessages(String conversationId, int pageSize, String cursor) {
        final List<MessageContainer> messages = stores.getMessages(conversationId);

        if (messages == null) {
            return null;
        }

        Paginator<MessageContainer> paginator = new Paginator<>(messages, (message) -> message.getMessage().getId())
                .perPage(pageSize).from(cursor);

        Page<MessageContainer> page = paginator.page();

        return MessageListResponsePayload.builder()
                .data(page.getData().stream().map(MessageResponsePayload::fromMessageContainer).collect(toList()))
                .paginationData(PaginationData.builder()
                        .nextCursor(page.getNextCursor())
                        .previousCursor(cursor)
                        .total(messages.size())
                        .build()).build();
    }
}
