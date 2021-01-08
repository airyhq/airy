package co.airy.core.media;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.media.dto.MessageMediaRequest;
import co.airy.core.media.services.MediaUpload;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.mapping.ContentMapper;
import co.airy.mapping.model.Content;
import co.airy.mapping.model.DataUrl;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.xml.bind.DatatypeConverter;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
public class MessageDataResolver {
    private final Logger log = AiryLoggerFactory.getLogger(MessageDataResolver.class);
    private final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final KafkaProducer<String, Metadata> producer;
    private final MediaUpload mediaUpload;
    private final ContentMapper mapper;
    private final ExecutorService executor;

    public MessageDataResolver(KafkaProducer<String, Metadata> producer,
                               MediaUpload mediaUpload,
                               ContentMapper mapper) {
        this.producer = producer;
        this.mediaUpload = mediaUpload;
        this.mapper = mapper;
        this.executor = Executors.newSingleThreadExecutor();
    }

    public void onMessageMediaRequest(String messageId, MessageMediaRequest messageMediaRequest) {
        executor.submit(() -> processMessageMediaRequests(messageId, messageMediaRequest));
    }

    private void processMessageMediaRequests(String messageId, MessageMediaRequest messageMediaRequest) {
        final Message message = messageMediaRequest.getMessage();
        final Map<String, String> metadataMap = Optional.ofNullable(messageMediaRequest.getMetadata()).orElse(new HashMap<>());

        final List<Content> contentList = mapper.renderWithDefaultAndLog(message, metadataMap);

        for (Content content : contentList) {
            if (!(content instanceof DataUrl)) {
                continue;
            }

            final String sourceUrl = ((DataUrl) content).getUrl();

            try {
                final URL url = new URL(sourceUrl);

                if (!mediaUpload.isUserStorageUrl(url) && !hasPersistentUrl(metadataMap, sourceUrl)) {
                    final String persistentUrl = mediaUpload.uploadMedia(url.openStream(), getFileName(sourceUrl));

                    final Metadata metadata = newMessageMetadata(messageId, getMessageKey(sourceUrl), persistentUrl);
                    storeMetadata(metadata);
                }
            } catch (MalformedURLException exception) {
                // If it's not a URL, this is an error on the source side
                log.warn("Source data url field is not a URL", exception);
            } catch (Exception exception) {
                log.error("Fetching message source content failed {}", messageMediaRequest);
            }
        }
    }

    private void storeMetadata(Metadata metadata) {
        final String metadataKey = getId(metadata).toString();
        try {
            producer.send(new ProducerRecord<>(applicationCommunicationMetadata, metadataKey, metadata)).get();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String getFileName(String sourceUrl) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-256");
            final String urlHash = DatatypeConverter.printHexBinary(digest.digest(sourceUrl.getBytes(StandardCharsets.UTF_8)));
            return String.format("data_%s", urlHash.toLowerCase());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private boolean hasPersistentUrl(Map<String, String> metadataMap, String sourceUrl) {
        return metadataMap.containsKey(getMessageKey(sourceUrl));
    }

    private String getMessageKey(String sourceUrl) {
        return String.format("data_%s", sourceUrl);
    }
}
