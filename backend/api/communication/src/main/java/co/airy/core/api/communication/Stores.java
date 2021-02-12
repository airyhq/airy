package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ReadReceipt;
import co.airy.avro.communication.SenderType;
import co.airy.core.api.communication.dto.Conversation;
import co.airy.core.api.communication.dto.CountAction;
import co.airy.core.api.communication.dto.MessagesTreeSet;
import co.airy.core.api.communication.dto.UnreadCountState;
import co.airy.core.api.communication.lucene.IndexingProcessor;
import co.airy.core.api.communication.lucene.LuceneDiskStore;
import co.airy.core.api.communication.lucene.LuceneProvider;
import co.airy.core.api.communication.lucene.ReadOnlyLuceneStore;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KGroupedStream;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;

import java.security.Key;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isChannelMetadata;
import static co.airy.model.metadata.MetadataRepository.isConversationMetadata;
import static co.airy.model.metadata.MetadataRepository.isMessageMetadata;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;
import static java.util.stream.Collectors.toCollection;

@Component
@RestController
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.CommunicationStoresTEST";

    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final WebSocketController webSocketController;
    private final LuceneProvider luceneProvider;

    private final String messagesStore = "messages-store";
    private final String metadataStore = "metadata-store";
    private final String conversationsStore = "conversations-store";
    private final String conversationsLuceneStore = "conversations-lucene-store";
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts().name();

    Stores(KafkaStreamsWrapper streams,
           KafkaProducer<String, SpecificRecordBase> producer,
           WebSocketController webSocketController,
           LuceneProvider luceneProvider
    ) {
        this.streams = streams;
        this.producer = producer;
        this.webSocketController = webSocketController;
        this.luceneProvider = luceneProvider;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.addStateStore(new LuceneDiskStore.Builder(conversationsLuceneStore, luceneProvider));

        final KStream<String, Message> messageStream = builder.stream(new ApplicationCommunicationMessages().name());

        final KTable<String, Channel> channelTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .peek((channelId, channel) -> webSocketController.onChannelUpdate(channel))
                .toTable();

        // conversation/message/channel metadata keyed by conversation/message/channel id
        final KTable<String, MetadataMap> metadataTable = builder.<String, Metadata>table(applicationCommunicationMetadata)
                .filter((metadataId, metadata) -> isConversationMetadata(metadata)
                        || isMessageMetadata(metadata) || isChannelMetadata(metadata))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor, Materialized.as(metadataStore));

        final KStream<String, CountAction> resetStream = builder.<String, ReadReceipt>stream(applicationCommunicationReadReceipts)
                .mapValues(readReceipt -> CountAction.reset(readReceipt.getReadDate()));

        // produce unread count metadata
        messageStream.selectKey((messageId, message) -> message.getConversationId())
                .peek((conversationId, message) -> webSocketController.onNewMessage(message))
                .mapValues(message -> CountAction.increment(message.getSentAt()))
                .merge(resetStream)
                .groupByKey()
                .aggregate(UnreadCountState::new, (conversationId, countAction, unreadCountState) -> {
                    if (countAction.getActionType().equals(CountAction.ActionType.INCREMENT)) {
                        unreadCountState.getMessageSentDates().add(countAction.getReadDate());
                    } else {
                        unreadCountState.setMessageSentDates(
                                unreadCountState.getMessageSentDates().stream()
                                        .filter((timestamp) -> timestamp > countAction.getReadDate())
                                        .collect(toCollection(HashSet::new)));
                    }

                    return unreadCountState;
                }).toStream().peek(webSocketController::onUnreadCount)
                .map((conversationId, unreadCountState) -> {
                    final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.UNREAD_COUNT,
                            unreadCountState.getUnreadCount().toString());
                    return KeyValue.pair(getId(metadata).toString(), metadata);
                })
                .to(applicationCommunicationMetadata);

        final KGroupedStream<String, MessageContainer> messageGroupedStream = messageStream.toTable()
                .leftJoin(metadataTable, (message, metadataMap) -> MessageContainer.builder()
                        .message(message)
                        .metadataMap(Optional.ofNullable(metadataMap).orElse(new MetadataMap()))
                        .build())
                .toStream()
                .filter((messageId, messageContainer) -> messageContainer != null)
                .groupBy((messageId, messageContainer) -> messageContainer.getMessage().getConversationId());


        // messages store
        messageGroupedStream.aggregate(MessagesTreeSet::new,
                ((key, value, aggregate) -> {
                    aggregate.update(value);
                    return aggregate;
                }), Materialized.as(messagesStore));

        // Conversation stores
        messageGroupedStream
                .aggregate(Conversation::new,
                        (conversationId, container, aggregate) -> {
                            if (aggregate.getLastMessageContainer() == null) {
                                aggregate = Conversation.builder()
                                        .lastMessageContainer(container)
                                        .createdAt(container.getMessage().getSentAt()) // Set this only once for the sent time of the first message
                                        .build();
                            }

                            // equals because messages can be updated
                            if (container.getMessage().getSentAt() >= aggregate.getLastMessageContainer().getMessage().getSentAt()) {
                                aggregate.setLastMessageContainer(container);
                            }

                            if (SenderType.SOURCE_CONTACT.equals(container.getMessage().getSenderType())) {
                                aggregate.setSourceConversationId(container.getMessage().getSenderId());
                            }

                            return aggregate;
                        })
                .join(channelTable, Conversation::getChannelId,
                        (conversation, channel) -> conversation.toBuilder()
                                // Channel metadata is not pre-joined but looked up on demand
                                .channelContainer(new ChannelContainer(channel, null)).build())
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    if (metadataMap != null) {
                        return conversation.toBuilder()
                                .metadata(metadataMap)
                                .build();
                    }
                    return conversation;
                }, Materialized.as(conversationsStore))
                .toStream()
                .process(IndexingProcessor.getSupplier(conversationsLuceneStore), conversationsLuceneStore);

        streams.start(builder.build(), appId);
    }

    public ReadOnlyKeyValueStore<String, Conversation> getConversationsStore() {
        return streams.acquireLocalStore(conversationsStore);
    }

    public ReadOnlyKeyValueStore<String, MessagesTreeSet> getMessagesStore() {
        return streams.acquireLocalStore(messagesStore);
    }

    public ReadOnlyKeyValueStore<String, MetadataMap> getMetadataStore() {
        return streams.acquireLocalStore(metadataStore);
    }

    public ReadOnlyLuceneStore getConversationLuceneStore() {
        return luceneProvider;
    }

    public void storeReadReceipt(ReadReceipt readReceipt) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationReadReceipts, readReceipt.getConversationId(), readReceipt)).get();
    }

    public void storeMetadata(Metadata metadata) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), metadata)).get();
    }

    public void deleteMetadata(Subject subject, String key) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMetadata, getId(subject, key).toString(), null)).get();
    }

    public MetadataMap getMetadata(String subjectId) {
        final ReadOnlyKeyValueStore<String, MetadataMap> metadataStore = getMetadataStore();
        return metadataStore.get(subjectId);
    }

    public List<Conversation> addChannelMetadata(List<Conversation> conversations) {
        final ReadOnlyKeyValueStore<String, MetadataMap> metadataStore = getMetadataStore();
        Map<String, MetadataMap> metadataCache = new HashMap<>();

        for (Conversation conversation : conversations) {
            final ChannelContainer container = conversation.getChannelContainer();
            final String channelId = container.getChannel().getId();
            if (metadataCache.containsKey(channelId)) {
                container.setMetadataMap(metadataCache.get(channelId));
            } else {
                final MetadataMap metadataMap = metadataStore.get(channelId);
                if (metadataMap != null) {
                    metadataCache.put(channelId, metadataMap);
                    container.setMetadataMap(metadataMap);
                }
            }
        }

        return conversations;
    }

    public List<MessageContainer> getMessages(String conversationId) {
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


    @Override
    public Health health() {
        getConversationsStore();
        getMessagesStore();
        getMetadataStore();

        return Health.status(Status.UP).build();
    }
}

