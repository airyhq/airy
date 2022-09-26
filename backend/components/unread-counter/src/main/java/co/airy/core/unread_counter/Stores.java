package co.airy.core.unread_counter;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.ReadReceipt;
import co.airy.avro.communication.ValueType;
import co.airy.core.unread_counter.dto.CountAction;
import co.airy.core.unread_counter.dto.UnreadCountState;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.schema.application.ApplicationCommunicationReadReceipts;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.model.metadata.MetadataKeys;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import static co.airy.model.message.MessageRepository.isNewMessage;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;
import static java.util.stream.Collectors.toCollection;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "UnreadCounterStores";

    private final KafkaStreamsWrapper streams;
    private final KafkaProducer<String, SpecificRecordBase> producer;

    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final String applicationCommunicationReadReceipts = new ApplicationCommunicationReadReceipts().name();

    Stores(KafkaStreamsWrapper streams,
           KafkaProducer<String, SpecificRecordBase> producer
    ) {
        this.streams = streams;
        this.producer = producer;
    }

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final KStream<String, Message> messageStream = builder.stream(new ApplicationCommunicationMessages().name());

        final KStream<String, CountAction> resetStream = builder.<String, ReadReceipt>stream(applicationCommunicationReadReceipts)
                .mapValues(readReceipt -> CountAction.reset(readReceipt.getReadDate()));

        // produce unread count metadata
        messageStream.filter((messageId, message) -> message != null && message.getIsFromContact() && isNewMessage(message))
                .selectKey((messageId, message) -> message.getConversationId())
                .mapValues(message -> CountAction.increment(message.getSentAt(), message.getId()))
                .merge(resetStream)
                .groupByKey()
                .aggregate(UnreadCountState::new, (conversationId, countAction, unreadCountState) -> {
                    if (countAction.getActionType().equals(CountAction.ActionType.INCREMENT)) {
                        unreadCountState.getUnreadMessagesSentAt().put(countAction.getMessageId(), countAction.getTimestamp());
                    } else {
                        unreadCountState.markMessagesReadAfter(countAction.getTimestamp());
                    }

                    return unreadCountState.toBuilder().build();
                }).toStream()
                .flatMap((conversationId, unreadCountState) -> {
                    final List<KeyValue<String, Metadata>> records = new ArrayList<>();

                    final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.UNREAD_COUNT,
                            unreadCountState.getUnreadCount().toString());
                    metadata.setValueType(ValueType.number);
                    records.add(KeyValue.pair(getId(metadata).toString(), metadata));

                    records.addAll(unreadCountState.getMessagesReadAt().entrySet().stream().map((entry) -> {
                        final Metadata messageMetadata = newMessageMetadata(entry.getKey(), MetadataKeys.MessageKeys.READ_BY_USER, entry.getValue().toString());
                        messageMetadata.setValueType(ValueType.number);
                        return KeyValue.pair(getId(messageMetadata).toString(), messageMetadata);
                    }).collect(Collectors.toSet()));

                    return records;
                })
                .to(applicationCommunicationMetadata);

        streams.start(builder.build(), appId);
    }

    public void storeReadReceipt(ReadReceipt readReceipt) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationReadReceipts, readReceipt.getConversationId(), readReceipt)).get();
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
        if (streams == null || !streams.state().isRunningOrRebalancing()) {
            return Health.down().build();
        }
        return Health.up().build();
    }
}

