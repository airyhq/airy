package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.dto.UnreadCountState;
import co.airy.core.api.communication.payload.MessageUpsertPayload;
import co.airy.core.api.communication.payload.UnreadCountPayload;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.message.dto.MessageResponsePayload;
import co.airy.model.metadata.dto.MetadataMap;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

import static co.airy.avro.communication.ChannelConnectionState.CONNECTED;
import static co.airy.date.format.DateFormat.isoFromMillis;
import static co.airy.model.channel.ChannelPayload.fromChannel;

@Service
public class WebSocketController {
    public static final String QUEUE_MESSAGE = "/queue/message";
    public static final String QUEUE_CHANNEL_CONNECTED = "/queue/channel/connected";
    public static final String QUEUE_CHANNEL_DISCONNECTED = "/queue/channel/disconnected";
    public static final String QUEUE_UNREAD_COUNT = "/queue/unread-count";

    private final SimpMessagingTemplate messagingTemplate;

    WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void onNewMessage(Message message) {
        final MessageUpsertPayload messageUpsertPayload = MessageUpsertPayload.builder()
                .channelId(message.getChannelId())
                .conversationId(message.getConversationId())
                .message(MessageResponsePayload.fromMessageContainer(new MessageContainer(message, new MetadataMap())))
                .build();
        messagingTemplate.convertAndSend(QUEUE_MESSAGE, messageUpsertPayload);
    }

    public void onUnreadCount(String conversationId, UnreadCountState unreadCountState) {
        final UnreadCountPayload unreadCountPayload = UnreadCountPayload.builder()
                .conversationId(conversationId)
                .unreadMessageCount(unreadCountState.getUnreadCount())
                .timestamp(isoFromMillis(Instant.now().toEpochMilli()))
                .build();

        messagingTemplate.convertAndSend(QUEUE_UNREAD_COUNT, unreadCountPayload);
    }

    public void onChannelUpdate(Channel channel) {
        final ChannelPayload channelPayload = fromChannel(channel);
        final String queue = CONNECTED.equals(channel.getConnectionState()) ?
                QUEUE_CHANNEL_CONNECTED :
                QUEUE_CHANNEL_DISCONNECTED;

        messagingTemplate.convertAndSend(queue, channelPayload);
    }
}
