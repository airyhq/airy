package co.airy.core.media;

import co.airy.avro.communication.Metadata;
import co.airy.core.media.services.MediaUpload;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.model.metadata.Subject;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.time.Instant;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static co.airy.model.metadata.MetadataRepository.isConversationMetadata;

@Component
public class MetadataResolver {
    private final Logger log = AiryLoggerFactory.getLogger(MetadataResolver.class);
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final KafkaProducer<String, Metadata> producer;
    private final MediaUpload mediaUpload;
    private final ExecutorService executor;

    public MetadataResolver(
            KafkaProducer<String, Metadata> producer,
            MediaUpload mediaUpload) {
        this.producer = producer;
        this.mediaUpload = mediaUpload;
        this.executor = Executors.newSingleThreadExecutor();
    }

    public boolean shouldResolve(Metadata metadata) {
        if (metadata == null) {
            return false;
        }

        URL dataUrl;

        try {
            dataUrl = new URL(metadata.getValue());
        } catch (Exception ignored) {
            return false;
        }

        return isConversationMetadata(metadata)
                && metadata.getKey().equals(MetadataKeys.Source.Contact.AVATAR_URL)
                && !mediaUpload.isUserStorageUrl(dataUrl);
    }

    public void onMetadata(Metadata metadata) {
        executor.submit(() -> processMetadataMediaRequest(metadata));
    }

    public void processMetadataMediaRequest(Metadata metadata) {
        URL dataUrl;

        try {
            dataUrl = new URL(metadata.getValue());
        } catch (Exception exception) {
            log.error("Metadata value not a valid url despite filtering {}", metadata, exception);
            return;
        }

        final String resolvedKey = metadata.getKey() + ".resolved";
        final Subject subject = getSubject(metadata);
        final String fileName = String.format("%s/%s", subject.getIdentifier(), resolvedKey);

        try {
            final String userStorageUrl = mediaUpload.uploadMedia(dataUrl.openStream(), fileName);

            storeMetadata(Metadata.newBuilder()
                    .setSubject(subject.toString())
                    .setKey(resolvedKey)
                    .setValue(userStorageUrl)
                    .setTimestamp(Instant.now().toEpochMilli())
                    .build());
        } catch (ExecutionException | InterruptedException exception) {
            throw new RuntimeException(exception);
        } catch (Exception exception) {
            log.error("Failed to upload metadata data url {}", metadata, exception);
        }
    }

    private void storeMetadata(Metadata metadata) throws ExecutionException, InterruptedException {
        final String metadataKey = getId(metadata).toString();
        producer.send(new ProducerRecord<>(applicationCommunicationMetadata, metadataKey, metadata)).get();
    }
}
