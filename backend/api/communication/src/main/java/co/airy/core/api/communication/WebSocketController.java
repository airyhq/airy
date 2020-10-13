package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.dto.UnreadCountState;
import co.airy.core.api.communication.payload.MessageUpsertPayload;
import co.airy.core.api.communication.payload.UnreadCountPayload;
import co.airy.payload.response.ChannelPayload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

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
        messagingTemplate.convertAndSend(QUEUE_MESSAGE, MessageUpsertPayload.fromMessage(message));
    }

    public void onUnreadCount(String conversationId, UnreadCountState unreadCountState) {
        final UnreadCountPayload unreadCountPayload = UnreadCountPayload.builder()
                .conversationId(conversationId)
                .unreadMessageCount(unreadCountState.getUnreadCount())
                .timestamp(ISO_FROM_MILLIS(Instant.now().toEpochMilli()))
                .build();

        messagingTemplate.convertAndSend(QUEUE_UNREAD_COUNT, unreadCountPayload);
    }

    public void onChannelUpdate(Channel channel) {
        final ChannelPayload channelPayload = ChannelPayload.builder()
                .imageUrl(channel.getImageUrl())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .name(channel.getName())
                .id(channel.getId())
                .build();

        if (ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())) {
            messagingTemplate.convertAndSend(QUEUE_CHANNEL_CONNECTED, channelPayload);
        } else {
            messagingTemplate.convertAndSend(QUEUE_CHANNEL_DISCONNECTED, channelPayload);
        }
    }
}
