package co.airy.core.webhook.publisher;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Webhook;
import co.airy.core.webhook.WebhookEvent;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.conversation.Conversation;
import co.airy.model.event.payload.ChannelUpdated;
import co.airy.model.event.payload.ConversationUpdated;
import co.airy.model.event.payload.Event;
import co.airy.model.event.payload.MessageCreated;
import co.airy.model.event.payload.MessageUpdated;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.dto.MetadataMap;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

import static co.airy.core.webhook.WebhookEvent.shouldSendFor;
import static co.airy.model.message.MessageRepository.isNewMessage;
import static co.airy.model.metadata.MetadataRepository.getSubject;

@Component
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean, HealthIndicator {
    private final Logger log = AiryLoggerFactory.getLogger(Stores.class);

    private static final String appId = "webhook.Publisher";
    private final String webhooksStore = "webhook-store";
    private final KafkaStreamsWrapper streams;
    private final BeanstalkPublisher beanstalkdPublisher;

    public Stores(KafkaStreamsWrapper streams, BeanstalkPublisher beanstalkdPublisher) {
        this.streams = streams;
        this.beanstalkdPublisher = beanstalkdPublisher;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Webhook>table(new ApplicationCommunicationWebhooks().name(), Materialized.as(webhooksStore));

        // channel.updated
        builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .foreach((channelId, channel) -> onRecord(ChannelUpdated.fromChannel(channel)));

        final KTable<String, MetadataMap> metadataTable = builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(MetadataMap::new, MetadataMap::adder, MetadataMap::subtractor);

        final KStream<String, Message> messageStream = builder.stream(new ApplicationCommunicationMessages().name(), Consumed.with(Topology.AutoOffsetReset.LATEST));

        // message.created
        messageStream.filter((messageId, message) -> message != null && isNewMessage(message))
                .foreach((messageId, message) -> onRecord(MessageCreated.fromMessage(message)));

        final KTable<String, MessageContainer> messageTable = messageStream.toTable()
                .leftJoin(metadataTable, (message, metadataMap) -> MessageContainer.builder()
                        .message(message)
                        .metadataMap(Optional.ofNullable(metadataMap).orElse(new MetadataMap()))
                        .build());

        // message.updated
        messageTable.toStream()
                .foreach((messageId, messageContainer) -> onRecord(MessageUpdated.fromMessageContainer(messageContainer)));

        // conversation.updated
        messageTable.groupBy((messageId, messageContainer) -> KeyValue.pair(messageContainer.getMessage().getConversationId(), messageContainer))
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
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    if (metadataMap != null) {
                        return conversation.toBuilder()
                                .metadataMap(metadataMap)
                                .build();
                    }
                    return conversation;
                })
                .toStream()
                .foreach((conversationId, conversation) -> onRecord(ConversationUpdated.fromConversation(conversation)));

        streams.start(builder.build(), appId);
    }

    private ReadOnlyKeyValueStore<String, Webhook> getWebhookStore() {
        return streams.acquireLocalStore(webhooksStore);
    }

    public Collection<Webhook> getAllWebhooks() {
        final ReadOnlyKeyValueStore<String, Webhook> store = getWebhookStore();

        final ArrayList<Webhook> webhooks = new ArrayList<>();
        store.all().forEachRemaining((it) -> webhooks.add(it.value));
        return webhooks;
    }

    private void onRecord(Event event) {
        try {
            log.info("on event {}", event);
            final Collection<Webhook> webhooks = getAllWebhooks();

            for (Webhook webhook : webhooks) {
                if (shouldSendFor(event, webhook)) {
                    beanstalkdPublisher.publishMessage(new WebhookEvent(webhook.getId(), event));
                }
            }
        } catch (Exception e) {
            log.error("failed to publish record", e);
        }
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

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }

    @Override
    public Health health() {
        getWebhookStore();
        return Health.up().build();
    }
}
