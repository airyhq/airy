package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.conversation.Conversation;
import co.airy.model.metadata.MetadataKeys;

import java.time.Duration;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutionException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.validation.constraints.Min;

import com.google.common.annotations.VisibleForTesting;

import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;

import lombok.AllArgsConstructor;
import lombok.Data;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static com.google.common.base.Strings.isNullOrEmpty;

@Component
public class AsyncSendMessagesHandler implements Runnable {

    private static final Logger log = AiryLoggerFactory.getLogger(AsyncSendMessagesHandler.class);

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
    private final long maxWaitMillis;
    private final long periodMillis;
    private volatile boolean keepAlive;
    

    AsyncSendMessagesHandler(
            Stores stores,
            @Value("${async-messages-handler.max-wait-millis}")
            long maxWaitSeconds,
            @Min(1)
            @Value("${async-messages-handler.check-period-millis}")
            long periodMillis) {
        this.stores = stores;
        this.pendingConversations = new ConcurrentLinkedQueue<>();
        this.keepAlive = true;
        this.maxWaitMillis = maxWaitSeconds;
        this.periodMillis = periodMillis;
        this.thread = new Thread(this);
    }

    @Override
    public void run() {
        final List<MessageConversationIdsPair> pending = new LinkedList<>();

        while (keepAlive) {
            try {
                Thread.sleep(this.periodMillis);

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
                    final boolean messageExpired = Duration.between(p.getNow(), Instant.now()).toMillis() > maxWaitMillis;
                    Message msg = getMessageById(p.getMessageId());

                    if (conversation == null && !messageExpired) {
                        continue;
                    }

                    if (conversation != null) {
                        Channel channel = conversation.getChannel();
                        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
                            msg = setMessageSateToFailed(msg, "Channel not connected");
                        }
                        updateMessage(conversation, msg);

                    } else if (messageExpired) {
                        setMessageSateToFailed(msg, "Converstaion id not found");
                    }
                    
                    // remove conversation from pending list
                    iter.remove();
                }
            } catch (Exception e) { 
                log.error(String.format("unexpected exception %s", e.toString()));
            }
        }
    }

    public void addPendingConversation(String messageId, String conversationId) {
        if (isNullOrEmpty(messageId) || isNullOrEmpty(conversationId)) {
            log.warn(String.format("messageId and/or conversationId is empty"));
            return;
        }
        pendingConversations.add(new MessageConversationIdsPair(messageId, conversationId, Instant.now()));
    }

    @PreDestroy
    public void destroy() {
        keepAlive = false;
    }

    @PostConstruct
    private void start() {
        thread.start();
    }

    private Message getMessageById(String messageId) throws NoSuchElementException {
        Message msg = Optional.ofNullable(stores.getMessageContainer(messageId))
            .map((mc) -> mc.getMessage())
            .orElse(null);

        if (msg == null) {
            throw new NoSuchElementException(String.format("no message found with this id %s", messageId));
        }

        return msg;
    }

    private Message setMessageSateToFailed(Message msg, String errorMessage) throws InterruptedException, ExecutionException {
        final Metadata metadata = newMessageMetadata(msg.getId(), MetadataKeys.MessageKeys.ERROR, errorMessage);
        stores.storeMetadata(metadata);

        Message m = Message.newBuilder(msg)
            .setDeliveryState(DeliveryState.FAILED)
            .build();
        stores.storeMessage(m);

        return m;
    }

    private Message updateMessage(Conversation conversation, Message msg) throws InterruptedException, ExecutionException {
        final Channel channel = conversation.getChannel();

        Message m = Message.newBuilder(msg)
            .setConversationId(conversation.getId())
            .setChannelId(channel.getId())
            .setSource(channel.getSource())
            .build();
        stores.storeMessage(m);

        return m;
    }


    @VisibleForTesting
    Thread getInternalThread() {
        return this.thread;
    }
}
