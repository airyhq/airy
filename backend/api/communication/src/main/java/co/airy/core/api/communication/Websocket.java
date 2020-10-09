package co.airy.core.api.communication;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.Message;
import co.airy.core.api.communication.dto.UnreadCountState;
import co.airy.core.api.communication.payload.MessageUpsertPayload;
import co.airy.core.api.communication.payload.UnreadCountPayload;
import co.airy.payload.response.ChannelPayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static co.airy.payload.format.DateFormat.ISO_FROM_MILLIS;

@Service
public class Websocket {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public final static String QUEUE_MESSAGE_UPSERT = "/queue/message/upsert";

    public void onNewMessage(Message message) {
        final MessageUpsertPayload messageUpsertPayload = MessageUpsertPayload.fromMessage(message);
        messagingTemplate.convertAndSend(QUEUE_MESSAGE_UPSERT, messageUpsertPayload);
    }

    public final static String QUEUE_UNREAD_COUNT = "/queue/unread-count/update";

    public void onUnreadCount(String conversationId, UnreadCountState unreadCountState) {
        final UnreadCountPayload unreadCountPayload = UnreadCountPayload.builder()
                .conversationId(conversationId)
                .unreadMessageCount(unreadCountState.getUnreadCount())
                .timestamp(ISO_FROM_MILLIS(Instant.now().toEpochMilli()))
                .build();

        messagingTemplate.convertAndSend(QUEUE_UNREAD_COUNT, unreadCountPayload);
    }

    public final static String QUEUE_CHANNEL_CONNECTED = "/queue/channel/connected";
    public final static String QUEUE_CHANNEL_DISCONNECTED = "/queue/channel/disconnected";

    public void onChannelUpdate(Channel channel) {
        if (ChannelConnectionState.CONNECTED.equals(channel.getConnectionState())) {
            final ChannelPayload channelPayload = ChannelPayload.builder()
                    .imageUrl(channel.getImageUrl())
                    .source(channel.getSource())
                    .sourceChannelId(channel.getSourceChannelId())
                    .name(channel.getName())
                    .id(channel.getId())
                    .build();

            messagingTemplate.convertAndSend(QUEUE_CHANNEL_CONNECTED, channelPayload);
        } else {
            messagingTemplate.convertAndSend(QUEUE_CHANNEL_DISCONNECTED, ChannelPayload.builder()
                    .id(channel.getId())
                    .build()
            );
        }
    }
}
