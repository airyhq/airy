package co.airy.core.api.conversations;

import co.airy.avro.communication.Message;
import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.MessageListRequestPayload;
import co.airy.core.api.conversations.payload.MessageListResponsePayload;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
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

@RestController
public class MessagesController {

    @Autowired
    StoreWorker worker;

    @PostMapping("/messages")
    ResponseEntity<MessageListResponsePayload> messageList(@RequestBody @Valid MessageListRequestPayload messageListRequestPayload) {
        final String conversationId = messageListRequestPayload.getConversationId();
        final Long pageSize = Optional.ofNullable(messageListRequestPayload.getPageSize()).orElse(20L);

        Long cursor = messageListRequestPayload.getCursor();

        if (cursor == null) {
            ReadOnlyKeyValueStore<String, Conversation> store = worker.getConversationsStore();
            Conversation conversation = store.get(conversationId);

            if (conversation == null) {
                return ResponseEntity.notFound().build();
            }

            cursor = conversation.getLastOffset();
        }

        MessageListResponsePayload response = fetchMessages(conversationId, pageSize, cursor);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }

    private MessageListResponsePayload fetchMessages(String conversationId, Long pageSize, Long cursor) {
        final ReadOnlyKeyValueStore<String, Message> store = worker.getMessagesStore();

        final long lowerOffset = Math.max(cursor - pageSize, 0);

        final String upperKey = messageOffsetKey(conversationId, cursor);
        final String lowerKey = messageOffsetKey(conversationId, lowerOffset);

        final KeyValueIterator<String, Message> iterator = store.range(lowerKey, upperKey);

        List<Message> messages = new ArrayList<>();
        while (iterator.hasNext()) {
            KeyValue<String, Message> entry = iterator.next();
            messages.add(entry.value);
        }

        return MessageListResponsePayload.builder()
                .data(messages.stream().map(MessageMapper::fromMessage).collect(Collectors.toList()))
                .responseMetadata(MessageListResponsePayload.ResponseMetadata.builder()
                        .nextCursor(lowerOffset > 0 ? lowerOffset : null) // don't return if we've reached the end
                        .previousCursor(cursor)
                        .total(messages.size())
                        .build()
                ).build();
    }

    private String messageOffsetKey(String conversationId, Long offset) {
        return String.format("%s_%d", conversationId, offset);
    }

}
