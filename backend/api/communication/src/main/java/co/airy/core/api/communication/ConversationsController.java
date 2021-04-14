package co.airy.core.api.communication;

import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ReadReceipt;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.ConversationIndex;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.core.api.communication.lucene.AiryAnalyzer;
import co.airy.core.api.communication.lucene.ExtendedQueryParser;
import co.airy.core.api.communication.lucene.ReadOnlyLuceneStore;
import co.airy.core.api.communication.payload.ConversationByIdRequestPayload;
import co.airy.core.api.communication.payload.ConversationListRequestPayload;
import co.airy.core.api.communication.payload.ConversationListResponsePayload;
import co.airy.core.api.communication.payload.ConversationResponsePayload;
import co.airy.core.api.communication.payload.ConversationTagRequestPayload;
import co.airy.core.api.communication.payload.PaginationData;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import co.airy.model.metadata.dto.MetadataMap;
import co.airy.pagination.Page;
import co.airy.pagination.Paginator;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.apache.lucene.queryparser.classic.ParseException;
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

import static co.airy.model.metadata.MetadataRepository.newConversationTag;
import static java.util.Comparator.comparing;
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
        if (queryFilter == null) {
            return listConversations(request);
        }

        return queryConversations(request);
    }

    private ResponseEntity<?> queryConversations(ConversationListRequestPayload requestPayload) {
        final ReadOnlyLuceneStore conversationLuceneStore = stores.getConversationLuceneStore();
        final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();

        final Query query;
        try {
            query = queryParser.parse(requestPayload.getFilters());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RequestErrorResponsePayload("Failed to parse Lucene query: " + e.getMessage()));
        }

        final LuceneQueryResult queryResult = conversationLuceneStore.query(query);

        final List<ConversationIndex> conversationIndices = queryResult.getConversations();

        final Paginator<ConversationIndex> paginator = new Paginator<>(conversationIndices, ConversationIndex::getId)
                .from(requestPayload.getCursor()).perPage(requestPayload.getPageSize());

        final Page<ConversationIndex> page = paginator.page();

        final List<Conversation> conversations = paginator.page().getData()
                .stream()
                .map((conversationIndex -> conversationsStore.get(conversationIndex.getId())))
                .collect(toList());

        final List<Conversation> enrichedConversations = stores.addChannelMetadata(conversations);

        int totalSize = queryResult.getTotal();

        return ResponseEntity.ok(
                ConversationListResponsePayload.builder()
                        .data(enrichedConversations.stream().map(ConversationResponsePayload::fromConversation).collect(Collectors.toList()))
                        .paginationData(
                                PaginationData.builder()
                                        .filteredTotal(conversationIndices.size())
                                        .nextCursor(page.getNextCursor())
                                        .previousCursor(page.getPreviousCursor())
                                        .total(totalSize)
                                        .build()
                        ).build());
    }

    private ResponseEntity<ConversationListResponsePayload> listConversations(ConversationListRequestPayload requestPayload) {
        final List<Conversation> allConversations = fetchAllConversations();
        int totalSize = allConversations.size();
        allConversations.sort(comparing(conversation -> ((Conversation) conversation).getLastMessageContainer().getMessage().getSentAt()).reversed());

        final Paginator<Conversation> paginator = new Paginator<>(allConversations, Conversation::getId)
                .from(requestPayload.getCursor()).perPage(requestPayload.getPageSize());

        final Page<Conversation> page = paginator.page();

        final List<Conversation> conversationsPage = page.getData();
        final List<Conversation> conversations = stores.addChannelMetadata(conversationsPage);

        return ResponseEntity.ok(
                ConversationListResponsePayload.builder()
                        .data(conversations.stream().map(ConversationResponsePayload::fromConversation).collect(Collectors.toList()))
                        .paginationData(
                                PaginationData.builder()
                                        .filteredTotal(allConversations.size())
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

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conversations.tag")
    ResponseEntity<?> conversationTag(@RequestBody @Valid ConversationTagRequestPayload requestPayload) {
        final String conversationId = requestPayload.getConversationId().toString();
        final String tagId = requestPayload.getTagId().toString();
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
    ResponseEntity<?> conversationUntag(@RequestBody @Valid ConversationTagRequestPayload requestPayload) {
        final String conversationId = requestPayload.getConversationId().toString();
        final String tagId = requestPayload.getTagId().toString();
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
}
