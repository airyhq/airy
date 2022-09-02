package co.airy.core.sources.api.actions;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.api.actions.dto.SendMessage;
import co.airy.core.sources.api.actions.payload.SendMessageResponsePayload;
import co.airy.model.metadata.MetadataKeys;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.streams.KeyValue;
import org.springframework.stereotype.Service;

import java.util.List;

import static co.airy.model.message.MessageRepository.updateDeliveryState;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Service
public class Actions {
    private final Endpoint endpoint;

    public Actions(Endpoint endpoint) {
        this.endpoint = endpoint;
    }

    public List<KeyValue<String, SpecificRecord>> sendMessage(SendMessage sendMessage) {
        final Message message = sendMessage.getMessage();

        try {
            final SendMessageResponsePayload response = endpoint.sendMessage(sendMessage);
            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ID, response.getSourceMessageId());
            updateDeliveryState(message, DeliveryState.DELIVERED);

            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        } catch (Exception e) {
            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.ERROR, e.getMessage());
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        }
    }
}
