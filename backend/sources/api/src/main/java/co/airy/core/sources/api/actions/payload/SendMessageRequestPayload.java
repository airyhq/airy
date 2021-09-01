package co.airy.core.sources.api.actions.payload;

import co.airy.avro.communication.Message;
import co.airy.core.sources.api.actions.dto.SendMessage;
import co.airy.model.conversation.Conversation;
import co.airy.model.metadata.dto.MetadataMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Optional;

import static co.airy.date.format.DateFormat.isoFromMillis;
import static co.airy.model.message.MessageRepository.resolveContent;

@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class SendMessageRequestPayload extends ActionPayload {
    private Payload payload;

    @Data
    @Builder
    public static class Payload {
        private MessagePayload message;
        private ConversationPayload conversation;
    }

    @Data
    @Builder
    public static class MessagePayload {
        private String id;
        private String sourceRecipientId;
        private Object content;
        private String sentAt;
    }

    @Data
    @Builder
    public static class ConversationPayload {
        private String id;
        private String channelId;
        private String sourceConversationId;
        private String createdAt;

        public static ConversationPayload fromConversation(Conversation conversation) {
            return builder()
                    .id(conversation.getId())
                    .channelId(conversation.getChannelId())
                    .sourceConversationId(conversation.getSourceConversationId())
                    .createdAt(isoFromMillis(conversation.getCreatedAt()))
                    .build();
        }
    }

    public static SendMessageRequestPayload fromSendMessage(SendMessage sendMessage) {
        final Message message = sendMessage.getMessage();
        final Conversation conversation = sendMessage.getConversation();

        final MessagePayload messagePayload = MessagePayload.builder()
                .id(message.getId())
                .sourceRecipientId(Optional.ofNullable(message.getSourceRecipientId()).orElseGet(() -> {
                    if (conversation != null) {
                        return conversation.getSourceConversationId();
                    }
                    return null;
                }))
                .content(resolveContent(message, new MetadataMap()))
                .sentAt(isoFromMillis(message.getSentAt()))
                .build();

        final Payload.PayloadBuilder builder = Payload.builder().message(messagePayload);

        if (conversation != null) {
            builder.conversation(ConversationPayload.fromConversation(sendMessage.getConversation()));
        }

        return new SendMessageRequestPayload(builder.build());
    }
}
