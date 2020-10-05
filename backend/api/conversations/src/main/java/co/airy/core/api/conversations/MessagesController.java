package co.airy.core.api.conversations;

import co.airy.avro.communication.Message;
import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.MessageListRequestPayload;
import co.airy.core.api.conversations.payload.MessageListResponsePayload;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import co.airy.payload.response.MessageResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.javatuples.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@RestController
public class MessagesController {

    @Autowired
    Stores stores;

    @PostMapping("/conversations.messages-list")
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
        final List<Message> messages = stores.getMessages(conversationId);

        if (messages == null) {
            return null;
        }

        Paginator<Message> paginator =
                new Paginator<>(messages, Message::getId)
                        .perPage(pageSize)
                        .from(cursor);

        Page<Message> page = paginator.page();

        return MessageListResponsePayload.builder()
                .data(messages.stream().map(Mapper::fromMessage).collect(Collectors.toList()))
                .responseMetadata(MessageListResponsePayload.ResponseMetadata.builder()
                        .nextCursor(page.getNextCursor()) // don't return if we've reached the end
                        .previousCursor(cursor)
                        .total(messages.size())
                        .build()
                ).build();
    }
}
