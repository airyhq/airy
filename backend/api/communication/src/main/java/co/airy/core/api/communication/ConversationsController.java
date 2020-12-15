package co.airy.core.api.communication;

import co.airy.avro.communication.MetadataAction;
import co.airy.avro.communication.MetadataActionType;
import co.airy.avro.communication.MetadataKeys;
import co.airy.avro.communication.ReadReceipt;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.ConversationIndex;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.core.api.communication.lucene.ReadOnlyLuceneStore;
import co.airy.core.api.communication.payload.ConversationByIdRequestPayload;
import co.airy.core.api.communication.payload.ConversationListRequestPayload;
import co.airy.core.api.communication.payload.ConversationListResponsePayload;
import co.airy.core.api.communication.payload.ConversationResponsePayload;
import co.airy.core.api.communication.payload.ConversationTagRequestPayload;
import co.airy.core.api.communication.payload.ResponseMetadata;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import co.airy.payload.response.RequestErrorResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.apache.lucene.analysis.core.WhitespaceAnalyzer;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;

@RestController
public class ConversationsController {
    private final Stores stores;
    private final Mapper mapper;

    ConversationsController(Stores stores, Mapper mapper) {
        this.stores = stores;
        this.mapper = mapper;
    }

    @PostMapping("/conversations.list")
    ResponseEntity<?> conversationList(@RequestBody @Valid ConversationListRequestPayload requestPayload) throws Exception {
        final String queryFilter = requestPayload.getFilters();
        if (queryFilter == null) {
            return listConversations(requestPayload);
        }

        return queryConversations(requestPayload);
    }

    private ResponseEntity<?> queryConversations(ConversationListRequestPayload requestPayload) throws Exception {
        final ReadOnlyLuceneStore conversationLuceneStore = stores.getConversationLuceneStore();
        final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();

        final QueryParser simpleQueryParser = new QueryParser("id", new WhitespaceAnalyzer());

        final Query query;
        try {
            query = simpleQueryParser.parse(requestPayload.getFilters());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload("Failed to parse Lucene query: " + e.getMessage()));
        }

        final LuceneQueryResult queryResult = conversationLuceneStore.query(query);

        final List<ConversationIndex> conversationIndices = queryResult.getConversations();

        final Paginator<ConversationIndex> paginator = new Paginator<>(conversationIndices, ConversationIndex::getId)
                .from(requestPayload.getCursor()).perPage(requestPayload.getPageSize());

        final Page<ConversationIndex> page = paginator.page();

        final List<ConversationResponsePayload> response = paginator.page().getData()
                .stream()
                .map((conversationIndex -> conversationsStore.get(conversationIndex.getId())))
                .map(mapper::fromConversation)
                .collect(toList());

        int totalSize = queryResult.getTotal();

        return ResponseEntity.ok(
                ConversationListResponsePayload.builder()
                        .data(response)
                        .responseMetadata(
                                ResponseMetadata.builder()
                                        .filteredTotal(conversationIndices.size())
                                        .nextCursor(page.getNextCursor())
                                        .previousCursor(page.getPreviousCursor())
                                        .total(totalSize)
                                        .build()
                        ).build());
    }

    private ResponseEntity<ConversationListResponsePayload> listConversations(ConversationListRequestPayload requestPayload) {
        final List<Conversation> conversations = fetchAllConversations();
        int totalSize = conversations.size();
        conversations.sort(comparing(conversation -> ((Conversation) conversation).getLastMessage().getSentAt()).reversed());

        final Paginator<Conversation> paginator = new Paginator<>(conversations, Conversation::getId)
                .from(requestPayload.getCursor()).perPage(requestPayload.getPageSize());

        final Page<Conversation> page = paginator.page();

        final List<ConversationResponsePayload> response = page.getData()
                .stream()
                .map(mapper::fromConversation)
                .collect(toList());

        return ResponseEntity.ok(
                ConversationListResponsePayload.builder()
                        .data(response)
                        .responseMetadata(
                                ResponseMetadata.builder()
                                        .filteredTotal(conversations.size())
                                        .nextCursor(page.getNextCursor())
                                        .previousCursor(page.getPreviousCursor())
                                        .total(totalSize)
                                        .build()
                        ).build());
    }

    @PostMapping("/conversations.info")
    ResponseEntity<?> conversationInfo(@RequestBody @Valid ConversationByIdRequestPayload requestPayload) {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();

        final Conversation conversation = store.get(requestPayload.getConversationId().toString());

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapper.fromConversation(conversation));
    }

    private List<Conversation> fetchAllConversations() {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();

        final KeyValueIterator<String, Conversation> iterator = store.all();

        List<Conversation> conversations = new ArrayList<>();
        iterator.forEachRemaining(kv -> conversations.add(kv.value));

        return conversations;
    }

    @PostMapping("/conversations.read")
    ResponseEntity<?> conversationMarkRead(@RequestBody @Valid ConversationByIdRequestPayload requestPayload) {
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final String conversationId = requestPayload.getConversationId().toString();
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

        return ResponseEntity.accepted().build();
    }

    @PostMapping("/conversations.tag")
    ResponseEntity<?> conversationTag(@RequestBody @Valid ConversationTagRequestPayload requestPayload) {
        return setConversationTag(requestPayload, MetadataActionType.SET);
    }

    @PostMapping("/conversations.untag")
    ResponseEntity<?> conversationUntag(@RequestBody @Valid ConversationTagRequestPayload requestPayload) {
        return setConversationTag(requestPayload, MetadataActionType.REMOVE);
    }

    private ResponseEntity<?> setConversationTag(ConversationTagRequestPayload requestPayload, MetadataActionType actionType) {
        final String conversationId = requestPayload.getConversationId().toString();
        final String tagId = requestPayload.getTagId().toString();
        final ReadOnlyKeyValueStore<String, Conversation> store = stores.getConversationsStore();
        final Conversation conversation = store.get(conversationId);

        if (conversation == null) {
            return ResponseEntity.notFound().build();
        }

        final MetadataAction metadataAction = MetadataAction.newBuilder()
                .setActionType(actionType)
                .setTimestamp(Instant.now().toEpochMilli())
                .setConversationId(conversationId)
                .setValue("")
                .setKey(String.format("%s.%s", MetadataKeys.TAGS, tagId))
                .build();

        try {
            stores.storeMetadata(metadataAction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new RequestErrorResponsePayload(e.getMessage()));
        }

        return ResponseEntity.accepted().build();
    }
}
