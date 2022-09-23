package co.airy.core.communication;

import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ValueType;
import co.airy.core.communication.payload.MessageListRequestPayload;
import co.airy.core.communication.payload.MessageListResponsePayload;
import co.airy.core.communication.payload.MessageSuggestRepliesRequestPayload;
import co.airy.core.communication.payload.PaginationData;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static co.airy.model.message.dto.MessageResponsePayload.fromMessageContainer;
import static co.airy.model.metadata.MetadataKeys.MessageKeys.SUGGESTIONS;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static java.util.stream.Collectors.toList;

@RestController
public class MessagesController {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Stores stores;

    MessagesController(Stores stores) {
        this.stores = stores;
    }

    @PostMapping("/messages.list")
    ResponseEntity<MessageListResponsePayload> messageList(@RequestBody @Valid MessageListRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final int pageSize = Optional.ofNullable(payload.getPageSize()).orElse(20);
        MessageListResponsePayload response = fetchMessages(conversationId, pageSize, payload.getCursor());

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
                        .build())
                .build();
    }

    @PostMapping({"/messages.suggestReplies", "/messages.suggest-replies"})
    ResponseEntity<?> messageSuggestReplies(@RequestBody @Valid MessageSuggestRepliesRequestPayload payload) {
        final String messageId = payload.getMessageId().toString();
        final MessageContainer container = stores.getMessageContainer(messageId);

        if (container == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            for (Map.Entry<String, MessageSuggestRepliesRequestPayload.Suggestion> entry : payload.getSuggestions().entrySet()) {
                final Metadata metadata = newMessageMetadata(messageId,
                        String.format("%s.%s.content", SUGGESTIONS, entry.getKey()),
                        objectMapper.writeValueAsString(entry.getValue().getContent()));
                metadata.setValueType(ValueType.object);
                container.getMetadataMap().put(metadata.getKey(), metadata);
                stores.storeMetadata(metadata);
            }
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.ok(fromMessageContainer(container));
    }

}
