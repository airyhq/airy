package co.airy.core.media;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.media.dto.MessageMediaRequest;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static co.airy.model.message.MessageRepository.isMessageNew;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isMessageMetadata;

@Component
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private final Logger log = AiryLoggerFactory.getLogger(Stores.class);

    private static final String appId = "media.Resolver";
    private final KafkaStreamsWrapper streams;
    private final MetadataResolver metadataResolver;
    private final MessageMediaResolver messageResolver;

    public Stores(KafkaStreamsWrapper streams,
                  MetadataResolver metadataResolver,
                  MessageMediaResolver messageResolver) {
        this.streams = streams;
        this.metadataResolver = metadataResolver;
        this.messageResolver = messageResolver;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        final StreamsBuilder builder = new StreamsBuilder();

        final KStream<String, Metadata> metadataTable = builder.stream(new ApplicationCommunicationMetadata().name());

        final KTable<String, Map<String, String>> messageMetadataTable = metadataTable.toTable()
                .filter((metadataId, metadata) -> isMessageMetadata(metadata))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(HashMap::new, (metadataId, metadata, metadataMap) -> {
                    metadataMap.put(metadata.getKey(), metadata.getValue());
                    return metadataMap;
                }, (metadataId, metadata, metadataMap) -> {
                    metadataMap.remove(metadata.getKey());
                    return metadataMap;
                });

        metadataTable
                .filter((metadataId, metadata) -> metadataResolver.shouldResolve(metadata))
                .foreach((metadataId, metadata) -> metadataResolver.onMetadata(metadata));

        builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                // Since the message content is immutable we only have to fetch
                // the media for new messages
                .filter((messageId, message) -> isMessageNew(message))
                .leftJoin(messageMetadataTable, MessageMediaRequest::new)
                .foreach(messageResolver::onMessageMediaRequest);

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
