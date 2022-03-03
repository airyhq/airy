package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.log.AiryLoggerFactory;
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
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.validation.constraints.Min;

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
    private final long maxWaitSeconds;
    private final long timePeriod;
    private volatile boolean keepAlive;
    

    AsyncSendMessagesHandler(
            Stores stores,
            @Value("${async-messages-handler.max-wait-seconds}")
            long maxWaitSeconds,
            @Min(1)
            @Value("${async-messages-handler.check-period-seconds}")
            long periodSeconds) {
        this.stores = stores;
        this.pendingConversations = new ConcurrentLinkedQueue<>();
        this.keepAlive = true;
        this.maxWaitSeconds = maxWaitSeconds;
        this.timePeriod = TimeUnit.SECONDS.toMillis(periodSeconds);
        this.thread = new Thread(this);
    }

    @PostConstruct
    private void start() {
        thread.start();
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
                        if (Duration.between(p.getNow(), Instant.now()).toSeconds() < maxWaitSeconds) {
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
                            log.error(String.format("no message found with this id %s", p.getMessageId()));
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

                Thread.sleep(this.timePeriod);

            } catch (Exception e) { 
                log.error(String.format("unexpected exception %s", e.toString()));
            }
        }
    }

    @PreDestroy
    public void destroy() {
        keepAlive = false;
    }


    public void addPendingConversation(String messageId, String conversationId) {
        if (isNullOrEmpty(messageId) || isNullOrEmpty(conversationId)) {
            log.warn(String.format("messageId and/or conversationId is empty"));
            return;
        }
        pendingConversations.add(new MessageConversationIdsPair(messageId, conversationId, Instant.now()));
    }
}
