package co.airy.core.api.conversations;

import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.filter.Filter;
import co.airy.core.api.conversations.payload.ConversationByIdRequestPayload;
import co.airy.core.api.conversations.payload.ConversationListRequestPayload;
import co.airy.core.api.conversations.payload.ConversationListResponsePayload;
import co.airy.core.api.conversations.payload.QueryFilterPayload;
import co.airy.payload.response.ConversationResponsePayload;
import co.airy.pagination.Paginator;
import co.airy.pagination.Page;
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
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;

@RestController
public class ConversationsController {

    @Autowired
    Stores stores;

    @Autowired
    private List<Filter<Conversation>> conversationFilters;

    @PostMapping("/conversations.list")
    ResponseEntity<ConversationListResponsePayload> conversationList(@RequestBody @Valid ConversationListRequestPayload requestPayload) {
        List<Conversation> conversations = fetchAllConversations();

        conversations.sort(comparing((conversation) -> conversation.getLastMessage().getSentAt()));

        final QueryFilterPayload filterPayload = requestPayload.getFilter();

        final int totalSize = conversations.size();

        if (filterPayload != null) {
            conversations = conversations.stream()
                    .filter(conversation -> conversationFilters.stream().allMatch(filter -> filter.filter(conversation, filterPayload)))
                    .collect(Collectors.toList());
        }

        final int filteredTotal = conversations.size();

        final Paginator<Conversation> paginator = new Paginator<>(conversations, Conversation::getId)
                .from(requestPayload.getCursor()).perPage(requestPayload.getPageSize());

        final Page<Conversation> page = paginator.page();

        final List<ConversationResponsePayload> response = page.getData()
                .stream()
                .map(Mapper::fromConversation)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ConversationListResponsePayload.builder()
                        .data(response)
                        .responseMetadata(
                                ConversationListResponsePayload.ResponseMetadata.builder()
                                        .filteredTotal(filteredTotal)
                                        .nextCursor(page.getNextCursor())
                                        .previousCursor(page.getPreviousCursor())
                                        .total(totalSize)
                                        .build()
                        ).build()
        );
    }


    @PostMapping("/conversations.by_id")
    ResponseEntity conversationById(@RequestBody @Valid ConversationByIdRequestPayload requestPayload) {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();

        final Conversation conversation = store.get(requestPayload.getConversationId().toString());

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Mapper.fromConversation(conversation));
    }


    private List<Conversation> fetchAllConversations() {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();

        final KeyValueIterator<String, Conversation> iterator = store.all();

        List<Conversation> conversations = new ArrayList<>();
        iterator.forEachRemaining(kv -> conversations.add(kv.value));

        return conversations;
    }
}
