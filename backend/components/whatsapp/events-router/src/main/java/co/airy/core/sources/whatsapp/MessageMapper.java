package co.airy.core.sources.whatsapp;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.whatsapp.dto.Event;
import co.airy.core.sources.whatsapp.model.Value;
import co.airy.core.sources.whatsapp.model.WebhookEntry;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.uuid.UUIDv5;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@Component
public class MessageMapper {
    private static final Logger log = AiryLoggerFactory.getLogger(MessageMapper.class);

    public List<KeyValue<String, SpecificRecordBase>> getRecords(Event event) {
        final WebhookEntry.Change change = event.getPayload();
        if(!"messages".equals(change.getField())) {
            // TODO implement remaining fields
            return List.of();
        }

        final Value value = change.getValue();

        List<KeyValue<String, SpecificRecordBase>> results = new ArrayList<>();
        for (Value.Contact contact : value.getContacts()) {
            final String conversationId = getConversationId(event.getChannel(), contact.getWaId());
            final Metadata metadata = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME, contact.getProfile().getName());
            results.add(KeyValue.pair(getId(metadata).toString(), metadata));
        }

        for (JsonNode message : value.getMessages()) {
            try {
                final String sourceConversationId = message.get("from").textValue();
                final String conversationId = getConversationId(event.getChannel(), sourceConversationId);
                final String id = message.get("id").textValue();
                final long timestamp = message.get("timestamp").asLong() * 1000;

                final Message airyMessage = Message.newBuilder()
                        .setChannelId(event.getChannel().getId())
                        .setContent(message.toString())
                        .setHeaders(Map.of())
                        .setId(UUIDv5.fromName(id).toString())
                        .setConversationId(conversationId)
                        .setIsFromContact(true)
                        .setDeliveryState(DeliveryState.DELIVERED)
                        .setSenderId(sourceConversationId)
                        .setSource("whatsapp")
                        .setSentAt(timestamp)
                        .build();
                results.add(KeyValue.pair(airyMessage.getId(), airyMessage));
            } catch (Exception e) {
                log.error("Error mapping message", e);
            }
        }

        return results;
    }

    private String getConversationId(Channel channel, String sourceConversationId) {
        return UUIDv5.fromNamespaceAndName(channel.getId(), sourceConversationId).toString();
    }
}
