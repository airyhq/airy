package co.airy.core.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ReadReceipt;
import co.airy.avro.communication.User;
import co.airy.avro.communication.ValueType;
import co.airy.core.communication.dto.CountAction;
import co.airy.core.communication.dto.Messages;
import co.airy.core.communication.dto.UnreadCountState;
import co.airy.core.communication.lucene.IndexingProcessor;
import co.airy.core.communication.lucene.LuceneDiskStore;
import co.airy.core.communication.lucene.LuceneProvider;
import co.airy.core.communication.lucene.ReadOnlyLuceneStore;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationConversations;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.schema.application.ApplicationCommunicationUsers;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.message.dto.Sender;
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

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

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
    private final String usersStore = "users-store";
    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();

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
        final KStream<String, Conversation> conversationsStream = messageGroupedTable
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
                            // If the deleted message was the last message we have no way of replacing it,
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
                .toStream();

        conversationsStream.to(new ApplicationCommunicationConversations().name());

        conversationsStream.process(IndexingProcessor.getSupplier(conversationsLuceneStore), conversationsLuceneStore);

        builder.table(new ApplicationCommunicationUsers().name(), Materialized.as(usersStore));

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

    public ReadOnlyKeyValueStore<String, User> getUsersStore() {
        return streams.acquireLocalStore(usersStore);
    }

    public ReadOnlyLuceneStore getConversationLuceneStore() {
        return luceneProvider;
    }

    public void storeMessage(Message message) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMessages, message.getId(), message)).get();
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

    // There are likely much more conversations than users or channels, therefore we
    // look them up once per conversation and cache the responses
    public List<Conversation> enrichConversations(List<Conversation> conversations) {
        final ReadOnlyKeyValueStore<String, MetadataMap> metadataStore = getMetadataStore();
        final ReadOnlyKeyValueStore<String, User> usersStore = getUsersStore();
        Map<String, MetadataMap> metadataCache = new HashMap<>();
        Map<String, User> userCache = new HashMap<>();

        for (Conversation conversation : conversations) {
            // Add channel metadata to the conversation
            final ChannelContainer container = conversation.getChannelContainer();
            final String channelId = container.getChannel().getId();
            MetadataMap metadataMap = metadataCache.get(channelId);
            if (metadataMap == null) {
                metadataMap = metadataStore.get(channelId);
                if (metadataMap != null) {
                    metadataCache.put(channelId, metadataMap);
                }
            }
            container.setMetadataMap(metadataMap);

            // Add sender user information to the conversation's last message
            final MessageContainer lastMessageContainer = conversation.getLastMessageContainer();
            final String senderId = lastMessageContainer.getMessage().getSenderId();

            User user = userCache.get(senderId);
            if (user == null) {
                user = usersStore.get(senderId);
                if (user != null) {
                    userCache.put(senderId, user);
                }
            }
            lastMessageContainer.setSender(Sender.builder().id(senderId)
                    .name(Optional.ofNullable(user).map(User::getName).orElse(null))
                    .avatarUrl(Optional.ofNullable(user).map(User::getAvatarUrl).orElse(null))
                    .build());
        }

        return conversations;
    }

    public List<MessageContainer> getMessages(String conversationId) {
        final ReadOnlyKeyValueStore<String, Messages> store = getMessagesStore();
        final Messages messagesTreeSet = store.get(conversationId);

        if (messagesTreeSet == null) {
            return null;
        }
        // Enrich messages with user information
        List<String> senderIds = messagesTreeSet.stream().map((container) -> container.getMessage().getSenderId()).collect(Collectors.toList());
        Map<String, User> users = collectUsers(senderIds);
        return messagesTreeSet.stream().peek((container) -> {
            final User user = users.get(container.getMessage().getSenderId());

            container.setSender(Sender.builder().id(container.getMessage().getSenderId())
                    .name(Optional.ofNullable(user).map(User::getName).orElse(null))
                    .avatarUrl(Optional.ofNullable(user).map(User::getAvatarUrl).orElse(null))
                    .build());
        }).collect(Collectors.toList());
    }

    private Map<String, User> collectUsers(List<String> userIds) {
        final Map<String, User> users = new HashMap<>();

        for (String userId : userIds) {
            if (!users.containsKey(userId)) {
                users.put(userId, getUser(userId));
            }
        }
        return users;
    }

    public User getUser(String userId) {
        return getUsersStore().get(userId);
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
        getUsersStore();

        return Health.status(Status.UP).build();
    }
}

