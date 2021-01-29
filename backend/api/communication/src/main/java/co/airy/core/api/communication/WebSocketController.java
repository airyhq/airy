package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.model.channel.ChannelPayload;
import co.airy.core.api.communication.dto.MessageContainer;
import co.airy.core.api.communication.dto.UnreadCountState;
import co.airy.core.api.communication.payload.MessageUpsertPayload;
import co.airy.core.api.communication.payload.UnreadCountPayload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.time.Instant;

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
    private final Mapper mapper;

    WebSocketController(SimpMessagingTemplate messagingTemplate, Mapper mapper) {
        this.messagingTemplate = messagingTemplate;
        this.mapper = mapper;
    }

    public void onNewMessage(Message message) {
        final MessageUpsertPayload messageUpsertPayload = MessageUpsertPayload.builder()
                .channelId(message.getChannelId())
                .conversationId(message.getConversationId())
                .message(mapper.fromMessageContainer(new MessageContainer(message, Map.of())))
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
