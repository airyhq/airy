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
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutionException;

import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;

import lombok.AllArgsConstructor;
import lombok.Data;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
@EnableScheduling
public class AsyncSendMessagesHandler {

    private static final Logger log = AiryLoggerFactory.getLogger(AsyncSendMessagesHandler.class);

    @AllArgsConstructor
    @Data
    private class PendingMessage {
        private Message msg;
        private Instant now;
    }

    private final Stores stores;
    private final ConcurrentLinkedQueue<PendingMessage> pendingMessages;
    private final List<PendingMessage> pending;
    private final long maxWaitMillis;
    

    AsyncSendMessagesHandler(
            Stores stores,
            @Value("${async-messages-handler.max-wait-millis}")
            long maxWaitMillis) {
        this.stores = stores;
        this.pendingMessages = new ConcurrentLinkedQueue<>();
        this.maxWaitMillis = maxWaitMillis;
        this.pending = new LinkedList<>();
    }

    public void addPendingMessage(Message message) {
        if (message == null) {
            log.warn(String.format("message is null"));
            return;
        }
        pendingMessages.add(new PendingMessage(message, Instant.now()));
    }

    @Scheduled(fixedRateString = "${async-messages-handler.check-period-millis}")
    private void run() {
        try {
            log.info(String.format("[%s] running task", Thread.currentThread().getName()));

            // Move all values to internal list
            PendingMessage pm;
            while ((pm = pendingMessages.poll()) != null) {
                pending.add(pm);
            }

            final ListIterator<PendingMessage> iter = pending.listIterator();
            while (iter.hasNext()) {
                PendingMessage pendingMsg = iter.next();

                final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
                final Conversation conversation = conversationsStore.get(pendingMsg.getMsg().getConversationId());
                final boolean messageExpired = Duration.between(pendingMsg.getNow(), Instant.now()).toMillis() > maxWaitMillis;

                if (conversation == null && !messageExpired) {
                    return;
                }

                Message msg = pendingMsg.getMsg();

                if (conversation != null) {
                    Channel channel = conversation.getChannel();
                    if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
                        msg = setMessageSateToFailed(msg, "Channel not connected");
                    }
                    updateMessage(conversation, msg);

                } else if (messageExpired) {
                    setMessageSateToFailed(msg, "Conversation id not found");
                }

                // remove message from pending list
                iter.remove();
            }
        } catch (Exception e) {
            log.error(String.format("unexpected exception %s", e.toString()));
        }
    }

    private Message setMessageSateToFailed(Message msg, String errorMessage) throws InterruptedException, ExecutionException {
        final Metadata metadata = newMessageMetadata(msg.getId(), MetadataKeys.MessageKeys.ERROR, errorMessage);
        stores.storeMetadata(metadata);

        return Message.newBuilder(msg)
            .setDeliveryState(DeliveryState.FAILED)
            .build();
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
}
