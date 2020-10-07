package co.airy.core.api.conversations;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataAction;
import co.airy.avro.communication.MetadataActionType;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.conversations.dto.Conversation;
import co.airy.core.api.conversations.dto.MessageUpsertPayload;
import co.airy.core.api.conversations.dto.MessagesTreeSet;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RestController
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {

    private static final String appId = "api.ConversationsController";

    @Autowired
    private KafkaStreamsWrapper streams;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final String MESSAGES_STORE = "messages-store";
    private final String CONVERSATIONS_STORE = "conversations-store";

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .selectKey((messageId, message) -> message.getConversationId());

        final KTable<String, Channel> channelTable = builder.table(new ApplicationCommunicationChannels().name());

        final KTable<String, Map<String, String>> metadataTable = builder.<String, MetadataAction>stream(new ApplicationCommunicationMetadata().name())
                .groupByKey()
                .aggregate(HashMap::new, (conversationId, metadataAction, aggregate) -> {
                    if (metadataAction.getActionType().equals(MetadataActionType.SET)) {
                        aggregate.put(metadataAction.getKey(), metadataAction.getValue());
                    } else {
                        aggregate.remove(metadataAction.getKey());
                    }

                    return aggregate;
                });

        messageStream
                .peek(this::sendMessageToWebsocket)
                .groupByKey()
                .aggregate(MessagesTreeSet::new,
                        ((key, value, aggregate) -> {
                            aggregate.add(value);
                            return aggregate;
                        }),
                        Materialized.as(MESSAGES_STORE)
                );

        messageStream.groupBy((messageId, message) -> message.getConversationId())
                .aggregate(Conversation::new,
                        (conversationId, message, aggregate) -> {
                            if (aggregate.getLastMessage() == null) {
                                aggregate = Conversation.builder()
                                        .lastMessage(message)
                                        .createdAt(message.getSentAt()) // Set this only once for the sent time of the first message
                                        .build();
                            }

                            // equals because messages can be updated
                            if (message.getSentAt() >= aggregate.getLastMessage().getSentAt()) {
                                aggregate.setLastMessage(message);
                            }

                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }

                            return aggregate;
                        })
                .join(channelTable, Conversation::getChannelId, (conversation, channel) -> {
                    conversation.setChannel(channel);
                    return conversation;
                })
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    conversation.setMetadata(metadataMap);
                    return conversation;
                }, Materialized.as(CONVERSATIONS_STORE));

        streams.start(builder.build(), appId);
    }

    private void sendMessageToWebsocket(String conversationId, Message message) {
        final MessageUpsertPayload messageUpsertPayload = MessageUpsertPayload.fromMessage(message);
        messagingTemplate.convertAndSend("/queue/airy/message/upsert", messageUpsertPayload);
    }

    public String messageOffsetKey(String conversationId, Long offset) {
        return String.format("%s_%d", conversationId, offset);
    }

    public ReadOnlyKeyValueStore<String, Conversation> getConversationsStore() {
        return streams.acquireLocalStore(CONVERSATIONS_STORE);
    }

    public ReadOnlyKeyValueStore<String, MessagesTreeSet> getMessagesStore() {
        return streams.acquireLocalStore(MESSAGES_STORE);
    }

    public List<Message> getMessages(String conversationId) {
        final ReadOnlyKeyValueStore<String, MessagesTreeSet> messagesStore = getMessagesStore();

        final MessagesTreeSet messagesTreeSet = messagesStore.get(conversationId);

        if (messagesTreeSet == null) {
            return null;
        }

        return new ArrayList<>(messagesTreeSet);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        startStream();
    }

    @GetMapping("/health")
    ResponseEntity<Void> health() {
        getConversationsStore();
        getMessagesStore();

        // If no exception was thrown by one of the above calls, this service is healthy
        return ResponseEntity.ok().build();
    }
}

