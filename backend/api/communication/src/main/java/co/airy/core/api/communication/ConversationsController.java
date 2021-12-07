package co.airy.core.api.communication;

import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ReadReceipt;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.core.api.communication.lucene.AiryAnalyzer;
import co.airy.core.api.communication.lucene.ExtendedQueryParser;
import co.airy.core.api.communication.lucene.ReadOnlyLuceneStore;
import co.airy.core.api.communication.payload.*;
import co.airy.model.conversation.Conversation;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.MatchAllDocsQuery;
import org.apache.lucene.search.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static co.airy.model.metadata.MetadataRepository.*;
import static java.util.stream.Collectors.toList;

@RestController
public class ConversationsController {
    private final Stores stores;
    private final ExtendedQueryParser queryParser;

    ConversationsController(Stores stores) throws IOException {
        this.stores = stores;
        this.queryParser = new ExtendedQueryParser(Set.of("unread_count"),
                Set.of("created_at"),
                "id",
                AiryAnalyzer.build());
        this.queryParser.setAllowLeadingWildcard(true);
    }

    @PostMapping("/conversations.list")
    ResponseEntity<?> conversationList(@RequestBody(required = false) @Valid ConversationListRequestPayload request) {
        request = Optional.ofNullable(request).orElse(new ConversationListRequestPayload());
        final String queryFilter = request.getFilters();
        final int pageSize = request.getPageSize();

        int cursor = 0;
        // To keep pagination endpoints uniform we also use the string type for the cursor here
        if (request.getCursor() != null) {
            try {
                cursor = Integer.parseInt(request.getCursor());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        Query query;
        if (queryFilter == null) {
            query = new MatchAllDocsQuery();
        } else {
            try {
                query = queryParser.parse(queryFilter);
            } catch (ParseException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new RequestErrorResponsePayload("Failed to parse Lucene query: " + e.getMessage()));
            }
        }

        return queryConversations(query, cursor, pageSize);
    }

    private ResponseEntity<?> queryConversations(Query query, Integer cursor, int pageSize) {
        final ReadOnlyLuceneStore conversationLuceneStore = stores.getConversationLuceneStore();
        final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();

        final LuceneQueryResult queryResult = conversationLuceneStore.query(query, cursor, pageSize);

        final List<Conversation> conversations = queryResult.getConversations()
                .stream()
                .map((conversationIndex -> conversationsStore.get(conversationIndex.getId())))
                .collect(toList());

        final List<Conversation> enrichedConversations = stores.addChannelMetadata(conversations);

        String nextCursor = null;
        if (cursor + pageSize < queryResult.getFilteredTotal()) {
            nextCursor = String.valueOf(cursor + pageSize);
        }

        return ResponseEntity.ok(
                ConversationListResponsePayload.builder()
                        .data(enrichedConversations.stream().map(ConversationResponsePayload::fromConversation).collect(Collectors.toList()))
                        .paginationData(
                                PaginationData.builder()
                                        .nextCursor(nextCursor)
                                        .previousCursor(String.valueOf(cursor))
                                        .total(queryResult.getFilteredTotal())
                                        .build()
                        ).build());
    }

    @PostMapping("/conversations.info")
    ResponseEntity<?> conversationInfo(@RequestBody @Valid ConversationByIdRequestPayload payload) {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(payload.getConversationId().toString());

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final MetadataMap channelMetadata = stores.getMetadata(conversation.getChannelId());
        conversation.getChannelContainer().setMetadataMap(channelMetadata);

        return ResponseEntity.ok(ConversationResponsePayload.fromConversation(conversation));
    }

    private List<Conversation> fetchAllConversations() {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();

        final KeyValueIterator<String, Conversation> iterator = store.all();

        List<Conversation> conversations = new ArrayList<>();
        iterator.forEachRemaining(kv -> conversations.add(kv.value));

        return conversations;
    }

    @PostMapping({"/conversations.markRead", "/conversations.mark-read"})
    ResponseEntity<?> conversationMarkRead(@RequestBody @Valid ConversationByIdRequestPayload payload) {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final String conversationId = payload.getConversationId().toString();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final ReadReceipt readReceipt = ReadReceipt.newBuilder()
                .setConversationId(conversationId)
                .setReadDate(Instant.now().toEpochMilli())
                .build();

        try {
            stores.storeReadReceipt(readReceipt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conversations.addNote")
    ResponseEntity<?> conversationAddNote(@RequestBody @Valid ConversationNoteRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final String noteId = payload.getNoteId().toString();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final Metadata metadata = newConversationNote(conversationId, noteId);

        try {
            stores.storeMetadata(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conversations.deleteNote")
    ResponseEntity<?> conversationDeleteNote(@RequestBody @Valid ConversationNoteRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final String noteId = payload.getNoteId().toString();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            final Subject subject = new Subject("conversation", conversationId);
            final String metadataKey = String.format("%s.%s", MetadataKeys.ConversationKeys.NOTES, noteId);
            stores.deleteMetadata(subject, metadataKey);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conversations.tag")
    ResponseEntity<?> conversationTag(@RequestBody @Valid ConversationTagRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final String tagId = payload.getTagId().toString();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final Metadata metadata = newConversationTag(conversationId, tagId);

        try {
            stores.storeMetadata(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conversations.untag")
    ResponseEntity<?> conversationUntag(@RequestBody @Valid ConversationTagRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final String tagId = payload.getTagId().toString();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            final Subject subject = new Subject("conversation", conversationId);
            final String metadataKey = String.format("%s.%s", MetadataKeys.ConversationKeys.TAGS, tagId);
            stores.deleteMetadata(subject, metadataKey);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping({"/conversations.setState", "/conversations.set-state"})
    ResponseEntity<?> conversationSetState(@RequestBody @Valid ConversationSetStateRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final String state = payload.getState();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.STATE, state);

        try {
            stores.storeMetadata(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping({"/conversations.removeState", "/conversations.remove-state"})
    ResponseEntity<?> conversationRemoveState(@RequestBody @Valid ConversationByIdRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            final Subject subject = new Subject("conversation", conversationId);
            stores.deleteMetadata(subject, MetadataKeys.ConversationKeys.STATE);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping({"/conversations.updateContact", "/conversations.update-contact"})
    ResponseEntity<?> conversationUpdateContact(@RequestBody @Valid ConversationUpdateContactRequestPayload payload) {
        final String conversationId = payload.getConversationId().toString();
        final String displayName = payload.getDisplayName();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME, displayName);

        try {
            stores.storeMetadata(metadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.noContent().build();
    }

}
