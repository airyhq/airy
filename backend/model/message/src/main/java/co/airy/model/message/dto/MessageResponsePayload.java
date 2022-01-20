package co.airy.model.message.dto;

import co.airy.avro.communication.Message;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

import static co.airy.date.format.DateFormat.isoFromMillis;
import static co.airy.model.message.MessageRepository.resolveContent;
import static co.airy.model.metadata.MetadataObjectMapper.getMetadataPayload;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponsePayload {
    private String id;
    private Object content;
    private String sentAt;
    private String deliveryState;
    private boolean isFromContact;
    private String source;
    private JsonNode metadata;
    private Sender sender;

    public static MessageResponsePayload fromMessageContainer(MessageContainer messageContainer) {
        final Message message = messageContainer.getMessage();
        final Sender sender = Optional.ofNullable(messageContainer.getSender())
                .orElse(messageContainer.getDefaultSender());
        return MessageResponsePayload.builder()
                .content(resolveContent(message, messageContainer.getMetadataMap()))
                .sender(sender)
                .isFromContact(message.getIsFromContact())
                .deliveryState(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .source(message.getSource())
                .metadata(getMetadataPayload(messageContainer.getMetadataMap()))
                .build();
    }

    public static MessageResponsePayload fromMessage(Message message) {
        return MessageResponsePayload.builder()
                .content(resolveContent(message))
                .sender(Sender.builder().id(message.getSenderId()).build())
                .isFromContact(message.getIsFromContact())
                .deliveryState(message.getDeliveryState().toString().toLowerCase())
                .id(message.getId())
                .sentAt(isoFromMillis(message.getSentAt()))
                .source(message.getSource())
                .build();
    }

}
