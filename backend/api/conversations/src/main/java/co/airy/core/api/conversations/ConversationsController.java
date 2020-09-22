package co.airy.core.api.conversations;

import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.payload.ConversationListRequestPayload;
import co.airy.payload.response.ConversationResponsePayload;
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

@RestController
public class ConversationsController {

    @Autowired
    StoreWorker worker;

    @PostMapping("/conversations")
    ResponseEntity<ConversationResponsePayload> conversationList(@RequestBody @Valid ConversationListRequestPayload requestPayload) {
        List<Conversation> conversations = fetchAllConversations();


        return null;
    }

    private List<Conversation> fetchAllConversations() {
        final ReadOnlyKeyValueStore<String, Conversation> store = worker.getConversationsStore();

        final KeyValueIterator<String, Conversation> iterator = store.all();

        List<Conversation> conversations = new ArrayList<>();
        while (iterator.hasNext()) {
            final Conversation conversation = iterator.next().value;
            conversations.add(conversation);
        }

        return conversations;
    }
}
