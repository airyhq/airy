package co.airy.core.sources.api;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.Source;
import co.airy.core.sources.api.payload.WebhookRequestPayload;
import co.airy.core.sources.api.services.SourceToken;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.model.metadata.MetadataObjectMapper;
import co.airy.model.metadata.MetadataRepository;
import co.airy.model.metadata.Subject;
import co.airy.spring.web.payload.RequestErrorResponsePayload;
import co.airy.uuid.UUIDv5;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static co.airy.model.metadata.MetadataRepository.getId;

@RestController
public class WebhookController {
    public static final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    public static final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
    private final SourceToken sourceToken;
    private final KafkaProducer<String, SpecificRecord> producer;
    private final List<String> allowedMetadataNamespaces = List.of("conversation", "message");

    public static Map<String, MetadataRepository.MetadataConstructor> metadataConstructorMap = Map.of(
            "conversation", MetadataRepository::newConversationMetadata,
            "message", MetadataRepository::newMessageMetadata
    );

    public WebhookController(SourceToken sourceToken, KafkaProducer<String, SpecificRecord> producer) {
        this.sourceToken = sourceToken;
        this.producer = producer;
    }

    @PostMapping("/sources.webhook")
    ResponseEntity<?> webhook(@RequestBody @Valid WebhookRequestPayload payload, Authentication authentication) throws Exception {
        final Source source = sourceToken.getSource(authentication);
        final String sourceId = source.getId();

        List<ProducerRecord<String, SpecificRecord>> records = new ArrayList<>();

        for (WebhookRequestPayload.MessagePayload messagePayload : payload.getMessages()) {
            final String messageId = UUIDv5.fromNamespaceAndName(sourceId, messagePayload.getSourceMessageId()).toString();
            final String conversationId = UUIDv5.fromNamespaceAndName(sourceId, messagePayload.getSourceConversationId()).toString();
            final String channelId = UUIDv5.fromNamespaceAndName(sourceId, messagePayload.getSourceChannelId()).toString();

            final Message message = Message.newBuilder()
                    .setSource(sourceId)
                    .setSentAt(messagePayload.getSentAt())
                    .setSenderId(messagePayload.getSourceSenderId())
                    .setIsFromContact(messagePayload.isFromContact())
                    .setId(messageId)
                    .setConversationId(conversationId)
                    .setHeaders(Map.of())
                    .setDeliveryState(DeliveryState.DELIVERED)
                    .setContent(messagePayload.getContent().toString())
                    .setChannelId(channelId)
                    .setUpdatedAt(null)
                    .build();

            records.add(new ProducerRecord<>(applicationCommunicationMessages, message.getId(), message));
        }

        for (WebhookRequestPayload.MetadataPayload metadataPayload : payload.getMetadata()) {
            final String namespace = metadataPayload.getNamespace();
            if (!allowedMetadataNamespaces.contains(namespace)) {
                return ResponseEntity.badRequest().body(new RequestErrorResponsePayload("Unknown metadata namespace " + namespace));
            }
            final String subjectId = UUIDv5.fromNamespaceAndName(sourceId, metadataPayload.getSourceId()).toString();
            final Subject subject = new Subject(namespace, subjectId);

            final List<Metadata> metadataList = MetadataObjectMapper.getMetadataFromJson(subject, metadataPayload.getMetadata());

            for (Metadata metadata : metadataList) {
                records.add(new ProducerRecord<>(applicationCommunicationMetadata, getId(metadata).toString(), metadata));
            }
        }

        try {
            for (ProducerRecord<String, SpecificRecord> record : records) {
                producer.send(record).get();
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}
