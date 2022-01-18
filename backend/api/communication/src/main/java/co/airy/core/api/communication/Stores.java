package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ReadReceipt;
import co.airy.core.api.communication.dto.CountAction;
import co.airy.core.api.communication.dto.Messages;
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
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KGroupedTable;
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
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.CommunicationStores";

    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final LuceneProvider luceneProvider;

    private final String messagesStore = "messages-store";
    private final String messagesByIdStore = "messages-by-id-store";
    private final String metadataStore = "metadata-store";
    private final String conversationsStore = "conversations-store";
    private final String channelsStore = "channels-store";
    private final String conversationsLuceneStore = "conversations-lucene-store";
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts().name();

    Stores(KafkaStreamsWrapper streams,
           KafkaProducer<String, SpecificRecordBase> producer,
           LuceneProvider luceneProvider
    ) {
        this.streams = streams;
        this.producer = producer;
        this.luceneProvider = luceneProvider;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.addStateStore(new LuceneDiskStore.Builder(conversationsLuceneStore, luceneProvider));

        final KStream<String, Message> messageStream = builder.stream(new ApplicationCommunicationMessages().name());

        final KTable<String, Channel> channelTable = builder.table(new ApplicationCommunicationChannels().name(), Materialized.as(channelsStore));

        // conversation/message/channel metadata keyed by conversation/message/channel id
        final KTable<String, MetadataMap> metadataTable = builder.<String, Metadata>table(applicationCommunicationMetadata)
                .filter((metadataId, metadata) -> isConversationMetadata(metadata)
                        || isMessageMetadata(metadata) || isChannelMetadata(metadata))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor, Materialized.as(metadataStore));

        final KStream<String, CountAction> resetStream = builder.<String, ReadReceipt>stream(applicationCommunicationReadReceipts)
                .mapValues(readReceipt -> CountAction.reset(readReceipt.getReadDate()));

        // produce unread count metadata
        messageStream.filter((conversationId, message) -> message != null && message.getIsFromContact())
                .selectKey((messageId, message) -> message.getConversationId())
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
                }).toStream()
                .map((conversationId, unreadCountState) -> {
                    final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.UNREAD_COUNT,
                            unreadCountState.getUnreadCount().toString());
                    return KeyValue.pair(getId(metadata).toString(), metadata);
                })
                .to(applicationCommunicationMetadata);

        final KGroupedTable<String, MessageContainer> messageGroupedTable = messageStream.toTable()
                .leftJoin(metadataTable, (message, metadataMap) -> MessageContainer.builder()
                        .message(message)
                        .metadataMap(Optional.ofNullable(metadataMap).orElse(new MetadataMap()))
                        .build(), Materialized.as(messagesByIdStore))
                .groupBy((messageId, messageContainer) -> KeyValue.pair(messageContainer.getMessage().getConversationId(), messageContainer));


        // messages store
        messageGroupedTable.aggregate(Messages::new,
                (key, value, aggregate) -> {
                    aggregate.update(value);
                    return aggregate;
                }, (key, value, aggregate) -> {
                    aggregate.remove(value);
                    return aggregate;
                }, Materialized.as(messagesStore));

        // Conversation stores
        messageGroupedTable
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

                            if (container.getMessage().getIsFromContact()) {
                                aggregate.setSourceConversationId(container.getMessage().getSenderId());
                            }

                            return aggregate;
                        }, (conversationId, container, aggregate) -> {
                            // If the deleted message was the last message we have no way of replacing it
                            // so we have no choice but to keep it
                            return aggregate;
                        })
                .join(channelTable, Conversation::getChannelId,
                        (conversation, channel) -> conversation.toBuilder()
                                // Channel metadata is not pre-joined but looked up on demand
                                .channelContainer(new ChannelContainer(channel, null)).build())
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    if (metadataMap != null) {
                        return conversation.toBuilder()
                                .metadataMap(metadataMap)
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

    public ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    public ReadOnlyKeyValueStore<String, Messages> getMessagesStore() {
        return streams.acquireLocalStore(messagesStore);
    }

    public ReadOnlyKeyValueStore<String, MessageContainer> getMessagesByIdStore() {
        return streams.acquireLocalStore(messagesByIdStore);
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

    public void deleteMetadata(Metadata metadata) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), null)).get();
    }

    public MetadataMap getMetadata(String subjectId) {
        final ReadOnlyKeyValueStore<String, MetadataMap> store = getMetadataStore();
        return store.get(subjectId);
    }

    public MessageContainer getMessageContainer(String messageId) {
        final ReadOnlyKeyValueStore<String, MessageContainer> store = getMessagesByIdStore();
        return store.get(messageId);
    }

    public List<Conversation> addChannelMetadata(List<Conversation> conversations) {
        final ReadOnlyKeyValueStore<String, MetadataMap> store = getMetadataStore();
        Map<String, MetadataMap> metadataCache = new HashMap<>();

        for (Conversation conversation : conversations) {
            final ChannelContainer container = conversation.getChannelContainer();
            final String channelId = container.getChannel().getId();
            if (metadataCache.containsKey(channelId)) {
                container.setMetadataMap(metadataCache.get(channelId));
            } else {
                final MetadataMap metadataMap = store.get(channelId);
                if (metadataMap != null) {
                    metadataCache.put(channelId, metadataMap);
                    container.setMetadataMap(metadataMap);
                }
            }
        }

        return conversations;
    }

    public List<MessageContainer> getMessages(String conversationId) {
        final ReadOnlyKeyValueStore<String, Messages> store = getMessagesStore();
        final Messages messagesTreeSet = store.get(conversationId);

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
        getChannelsStore();
        getMessagesStore();
        getMessagesByIdStore();
        getMetadataStore();

        return Health.status(Status.UP).build();
    }
}

