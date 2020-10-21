package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.MetadataAction;
import co.airy.avro.communication.MetadataActionType;
import co.airy.avro.communication.ReadReceipt;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.CountAction;
import co.airy.core.api.communication.dto.MessagesTreeSet;
import co.airy.core.api.communication.dto.UnreadCountState;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KGroupedStream;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.javatuples.Pair;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import static java.util.stream.Collectors.toCollection;

@Component
@RestController
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.CommunicationStores";

    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final WebSocketController webSocketController;

    private final String MESSAGES_STORE = "messages-store";
    private final String CONVERSATIONS_STORE = "conversations-store";
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts().name();

    Stores(KafkaStreamsWrapper streams,
           KafkaProducer<String, SpecificRecordBase> producer,
           WebSocketController webSocketController) {
        this.streams = streams;
        this.producer = producer;
        this.webSocketController = webSocketController;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .selectKey((messageId, message) -> message.getConversationId())
                .peek((conversationId, message) -> webSocketController.onNewMessage(message));

        final KTable<String, Channel> channelTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .peek((channelId, channel) -> webSocketController.onChannelUpdate(channel))
                .toTable();

        final KTable<String, Map<String, String>> metadataTable = builder.<String, MetadataAction>stream(applicationCommunicationMetadata)
                .groupByKey()
                .aggregate(HashMap::new, (conversationId, metadataAction, aggregate) -> {
                    if (metadataAction.getActionType().equals(MetadataActionType.SET)) {
                        aggregate.put(metadataAction.getKey(), metadataAction.getValue());
                    } else {
                        aggregate.remove(metadataAction.getKey());
                    }

                    return aggregate;
                });

        final KStream<String, Pair<CountAction, Long>> resetStream = builder.<String, ReadReceipt>stream(applicationCommunicationReadReceipts)
                .mapValues((readReceipt -> Pair.with(CountAction.RESET, readReceipt.getReadDate())));

        // unread counts
        final KTable<String, UnreadCountState> unreadCountTable = messageStream
                .mapValues((message -> Pair.with(CountAction.INCREMENT, message.getSentAt())))
                .merge(resetStream)
                .groupByKey()
                .aggregate(UnreadCountState::new, (conversationId, pair, unreadCountState) -> {
                    final CountAction countAction = pair.getValue0();
                    final Long actionDate = pair.getValue1();

                    if (countAction.equals(CountAction.INCREMENT)) {
                        unreadCountState.getMessageSentDates().add(actionDate);
                    } else {
                        unreadCountState.setMessageSentDates(
                                unreadCountState.getMessageSentDates().stream()
                                        .filter((timestamp) -> timestamp > actionDate)
                                        .collect(toCollection(HashSet::new)));
                    }

                    return unreadCountState;
                });

        unreadCountTable.toStream().peek(webSocketController::onUnreadCount);

        final KGroupedStream<String, Message> messageGroupedStream = messageStream.groupByKey();

        // messages store
        messageGroupedStream
                .aggregate(MessagesTreeSet::new,
                        ((key, value, aggregate) -> {
                            aggregate.add(value);
                            return aggregate;
                        }),
                        Materialized.as(MESSAGES_STORE)
                );

        // conversations store
        messageGroupedStream
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
                    if (metadataMap != null) {
                        conversation.setMetadata(metadataMap);
                    }
                    return conversation;
                })
                .leftJoin(unreadCountTable, (conversation, unreadCountState) -> {
                    if (unreadCountState != null) {
                        conversation.setUnreadCount(unreadCountState.getUnreadCount());
                    }
                    return conversation;
                }, Materialized.as(CONVERSATIONS_STORE));

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Conversation> getConversationsStore() {
        return streams.acquireLocalStore(CONVERSATIONS_STORE);
    }

    public ReadOnlyKeyValueStore<String, MessagesTreeSet> getMessagesStore() {
        return streams.acquireLocalStore(MESSAGES_STORE);
    }

    public void storeReadReceipt(ReadReceipt readReceipt) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationReadReceipts, readReceipt.getConversationId(), readReceipt)).get();
    }

    public void storeMetadata(MetadataAction metadataAction) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMetadata, metadataAction.getConversationId(), metadataAction)).get();
    }

    public List<Message> getMessages(String conversationId) {
        final ReadOnlyKeyValueStore<String, MessagesTreeSet> messagesStore = getMessagesStore();

        final MessagesTreeSet messagesTreeSet = messagesStore.get(conversationId);

        return messagesTreeSet == null ? null : new ArrayList<>(messagesTreeSet);
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

