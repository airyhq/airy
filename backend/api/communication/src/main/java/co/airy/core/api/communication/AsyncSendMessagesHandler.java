package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;

import java.time.Duration;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Optional;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static com.google.com.google.common.base.Strings.isNullOrEmpty;

@Component
public class AsyncSendMessagesHandler implements DisposableBean, Runnable {

    @AllArgsConstructor
    @Data
    private class MessageConversationIdsPair {
        private String messageId;
        private String conversationId;
        private Instant now;
    }

    private final Stores stores;
    private final ConcurrentLinkedQueue<MessageConversationIdsPair> pendingConversations;
    private final Thread thread;
    private volatile boolean keepAlive;
    

    AsyncSendMessagesHandler(Stores stores) {
        this.stores = stores;
        this.pendingConversations = new ConcurrentLinkedQueue<>();
        this.keepAlive = true;
        this.thread = new Thread(this);
    }

    @Override
    public void run() {
        final List<MessageConversationIdsPair> pending = new LinkedList<>();

        while (keepAlive) {
            try {
                // Move all values to internal list
                MessageConversationIdsPair pair;
                while ((pair = pendingConversations.poll()) != null) {
                    pending.add(pair);
                }

                final ListIterator<MessageConversationIdsPair> iter = pending.listIterator();
                while (iter.hasNext()) {
                    MessageConversationIdsPair p = iter.next();

                    final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
                    final Conversation conversation = conversationsStore.get(p.getConversationId());
                    if (conversation == null) {
                        //FIXME: Make this configurable
                        if (Duration.between(p.getNow(), Instant.now()).toSeconds() < 30) {
                            continue;
                        }

                        final Metadata metadata = newMessageMetadata(
                                p.getMessageId(),
                                MetadataKeys.MessageKeys.ERROR,    
                                String.format("Converstaion Id not found"));
                        stores.storeMetadata(metadata);
                    } else {
                        Channel channel = conversation.getChannel();
                        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
                            final Metadata metadata = newMessageMetadata(
                                    p.getMessageId(),
                                    MetadataKeys.MessageKeys.ERROR,    
                                    String.format("Channel not connected"));
                            stores.storeMetadata(metadata);
                        }

                        MessageContainer msg = Optional.ofNullable(stores.getMessageContainer(p.getMessageId()))
                            .orElseGet(MessageContainer::new);
                        if (msg.getMessage() == null) {
                            //TODO: log error
                        } else {
                            Message m = Message.newBuilder(msg.getMessage())
                                .setChannelId(channel.getId())
                                .build();
                            stores.storeMessage(m);
                        }
                    }
                    
                    // remove conversation from pending list
                    iter.remove();
                }

                //FIXME: Make this configurable
                Thread.sleep(1000);

            } catch (Exception e) { 
                //FIXME: add logs
            }
        }
    }

    @Override
    public void destroy() {
        keepAlive = false;
    }

    public void addPendingConversation(String messageId, String conversationId) {
        pendingConversations.add(new MessageConversationIdsPair(messageId, conversationId, Instant.now()));
    }
}
