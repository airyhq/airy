package co.airy.core.sources.viber;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.MetadataKeys;
import co.airy.uuid.UUIDv5;
import com.viber.bot.Request;
import com.viber.bot.event.incoming.IncomingConversationStartedEvent;
import com.viber.bot.event.incoming.IncomingDeliveredEvent;
import com.viber.bot.event.incoming.IncomingMessageEvent;
import com.viber.bot.event.incoming.IncomingSeenEvent;
import com.viber.bot.profile.UserProfile;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.streams.KeyValue;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
public class EventsRouter {

    public List<KeyValue<String, SpecificRecord>> onEvent(String key, String payload) {
        final Request request = Request.fromJsonString(payload);
        final String channelId = UUIDv5.fromName(key).toString();

        switch (request.getEvent().getEvent()) {
            case CONVERSATION_STARTED: {
                final IncomingConversationStartedEvent event = (IncomingConversationStartedEvent) request.getEvent();
                final String senderId = event.getUser().getId();
                final String conversationId = UUIDv5.fromNamespaceAndName(channelId, senderId).toString();
                final String messageId = getMessageId(event.getToken());

                return new ArrayList<>() {
                    {
                        add(KeyValue.pair(messageId, Message.newBuilder()
                                .setChannelId(channelId)
                                .setContent(payload)
                                .setConversationId(conversationId)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setHeaders(Map.of())
                                .setId(messageId)
                                .setIsFromContact(true)
                                .setSenderId(senderId)
                                .setSentAt(event.getTimestamp())
                                .setSource("viber").build()));
                        addAll(getMetadata(conversationId, event.getUser()));
                    }
                };
            }

            case MESSAGE_RECEIVED: {
                final IncomingMessageEvent event = (IncomingMessageEvent) request.getEvent();
                final String senderId = event.getSender().getId();
                final String conversationId = UUIDv5.fromNamespaceAndName(channelId, senderId).toString();
                final String messageId = getMessageId(event.getToken());

                return new ArrayList<>() {
                    {
                        add(KeyValue.pair(messageId, Message.newBuilder()
                                .setChannelId(channelId)
                                .setContent(payload)
                                .setConversationId(conversationId)
                                .setDeliveryState(DeliveryState.DELIVERED)
                                .setHeaders(Map.of())
                                .setId(messageId)
                                .setIsFromContact(true)
                                .setSenderId(senderId)
                                .setSentAt(event.getTimestamp())
                                .setSource("viber").build()));
                        addAll(getMetadata(conversationId, event.getSender()));
                    }
                };
            }

            case MESSAGE_DELIVERED: {
                final IncomingDeliveredEvent event = (IncomingDeliveredEvent) request.getEvent();
                final String messageId = getMessageId(event.getToken());
                final Metadata metadata = newMessageMetadata(messageId, MetadataKeys.MessageKeys.Source.DELIVERY_STATE, "delivered");
                return List.of(KeyValue.pair(getId(metadata).toString(), metadata));
            }

            case MESSAGE_SEEN: {
                final IncomingSeenEvent event = (IncomingSeenEvent) request.getEvent();
                final String messageId = getMessageId(event.getToken());
                final Metadata metadata = newMessageMetadata(messageId, MetadataKeys.MessageKeys.Source.DELIVERY_STATE, "seen");
                return List.of(KeyValue.pair(getId(metadata).toString(), metadata));
            }

            default: return List.of();
        }
    }

    private String getMessageId(Long messageToken) {
        return UUIDv5.fromNamespaceAndName("viber", messageToken.toString()).toString();
    }

    private List<KeyValue<String, SpecificRecord>> getMetadata(String conversationId, UserProfile userProfile) {
        final ArrayList<KeyValue<String, SpecificRecord>> result = new ArrayList<>();

        if (userProfile.getName() != null) {
            final Metadata name = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME, userProfile.getName());
            result.add(KeyValue.pair(getId(name).toString(), name));
        }

        if (userProfile.getAvatar() != null) {
            final Metadata avatar = newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Contact.AVATAR_URL, userProfile.getAvatar());
            result.add(KeyValue.pair(getId(avatar).toString(), avatar));
        }

        return result;
    }
}
