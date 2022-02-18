package co.airy.core.api.communication.service;

import co.airy.core.api.communication.Stores;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.model.conversation.Conversation;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.stereotype.Component;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Component
public class SendMessageExecutorService {

    private static ExecutorService executor;

    public Future<Conversation> getFutureCallableConversationAsync(Stores stores, SendMessageRequestPayload payload){
        executor = Executors.newSingleThreadExecutor();
        Callable<Conversation> getConversationAsync = () -> {
            int retries = 0;
            Conversation conversation;
            do {
                final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
                conversation = conversationsStore.get(payload.getConversationId().toString());
                if(conversation == null) {
                    retries++;
                }
                else{
                    break;
                }
            }while (retries++ < 5);
            return conversation;
        };
        return executor.submit(getConversationAsync);
    }

     public void shutdown(){
        executor.shutdown();
    }

}
