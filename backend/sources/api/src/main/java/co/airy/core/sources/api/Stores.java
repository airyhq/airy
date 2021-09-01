package co.airy.core.sources.api;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Source;
import co.airy.core.sources.api.actions.Actions;
import co.airy.core.sources.api.actions.dto.SendMessage;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationSources;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.channel.dto.ChannelContainer;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.getSubject;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "sources.Api";

    private final String channelsStore = "channels-store";
    private final String sourcesStore = "sources-store";
    private final String metadataStore = "metadata-store";
    private final Actions actions;
    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecord> producer;

    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();
    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationSources = new ApplicationCommunicationSources().name();

    public Stores(Actions actions, KafkaStreamsWrapper streams, KafkaProducer<String, SpecificRecord> producer) {
        this.actions = actions;
        this.streams = streams;
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent applicationStartedEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.table(new ApplicationCommunicationChannels().name(), Materialized.as(channelsStore));
        final KTable<String, Source> sourceTable = builder.table(new ApplicationCommunicationSources().name(), Materialized.as(sourcesStore));
        final KTable<String, Source> actionSources = sourceTable.filter((sourceId, source) -> source.getActionEndpoint() != null);

        // Metadata table keyed by subject identifier id
        final KTable<String, MetadataMap> metadataTable = builder.<String, Metadata>table(applicationCommunicationMetadata)
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor, Materialized.as(metadataStore));


        final KStream<String, Message> messageStream = builder.stream(new ApplicationCommunicationMessages().name());

        // Conversation table
        final KTable<String, Conversation> conversationTable = messageStream.toTable()
                .groupBy((messageId, message) -> KeyValue.pair(message.getConversationId(), message))
                .aggregate(Conversation::new,
                        (conversationId, message, aggregate) -> {
                            if (aggregate.getLastMessageContainer() == null) {
                                aggregate = Conversation.builder()
                                        .lastMessageContainer(new MessageContainer(message, new MetadataMap()))
                                        .createdAt(message.getSentAt()) // Set this only once for the sent time of the first message
                                        .build();
                            }

                            // equals because messages can be updated
                            if (message.getSentAt() >= aggregate.getLastMessageContainer().getMessage().getSentAt()) {
                                aggregate.setLastMessageContainer(new MessageContainer(message, new MetadataMap()));
                            }

                            if (message.getIsFromContact()) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }

                            return aggregate;
                        }, (conversationId, container, aggregate) -> {
                            // If the deleted message was the last message we have no way of replacing it
                            // so we have no choice but to keep it
                            return aggregate;
                        });



        // Actions:
        // Send messages
        messageStream.filter((messageId, message) -> message != null && message.getDeliveryState().equals(DeliveryState.PENDING))
                .leftJoin(conversationTable, (message, conversation) -> SendMessage.builder().message(message).conversation(conversation).build())
                .selectKey((messageId, message) -> message.getMessage().getSource())
                .join(actionSources, (sendMessage, source) -> sendMessage.toBuilder().source(source).build())
                .flatMap((conversationId, sendMessage) -> actions.sendMessage(sendMessage))
                .to((recordId, record, context) -> {
                    if (record instanceof Metadata) {
                        return applicationCommunicationMetadata;
                    }
                    if (record instanceof Message) {
                        return applicationCommunicationMessages;
                    }

                    throw new IllegalStateException("Unknown type for record " + record);
                });



        streams.start(builder.build(), appId);
    }

    public void storeSource(Source source) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationSources, source.getId(), source)).get();
    }

    public void deleteSource(String sourceId) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationSources, sourceId, null)).get();
    }

    public void storeChannelContainer(ChannelContainer container) throws ExecutionException, InterruptedException {
        storeChannel(container.getChannel());
        storeMetadataMap(container.getMetadataMap());
    }

    public void storeMetadataMap(MetadataMap metadataMap) throws ExecutionException, InterruptedException {
        for (Metadata metadata : metadataMap.values()) {
            producer.send(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), metadata)).get();
        }
    }

    public void storeChannel(Channel channel) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
    }

    private ReadOnlyKeyValueStore<String, Channel> getChannelsStore() {
        return streams.acquireLocalStore(channelsStore);
    }

    public List<Channel> getAllChannels() {
        final ReadOnlyKeyValueStore<String, Channel> store = getChannelsStore();
        final ArrayList<Channel> channels = new ArrayList<>();
        store.all().forEachRemaining((record) -> channels.add(record.value));
        return channels;
    }

    private ReadOnlyKeyValueStore<String, Source> getSourcesStore() {
        return streams.acquireLocalStore(sourcesStore);
    }

    public Source getSource(String id) {
        final ReadOnlyKeyValueStore<String, Source> store = getSourcesStore();
        return store.get(id);
    }

    public List<Source> getAllSources() {
        final ReadOnlyKeyValueStore<String, Source> store = getSourcesStore();
        final ArrayList<Source> sources = new ArrayList<>();
        store.all().forEachRemaining((record) -> sources.add(record.value));
        return sources;
    }

    @Override
    public void destroy() {
        streams.close();
    }

    @Override
    public Health health() {
        getChannelsStore();
        getSourcesStore();
        return Health.up().build();
    }

}
