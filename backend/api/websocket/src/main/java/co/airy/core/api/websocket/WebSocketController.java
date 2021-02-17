package co.airy.core.api.websocket;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.model.event.payload.ChannelEvent;
import co.airy.model.event.payload.MessageEvent;
import co.airy.model.event.payload.MetadataEvent;
import co.airy.model.channel.ChannelPayload;
import co.airy.model.metadata.dto.MetadataMap;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketController {
    public static final String QUEUE_EVENTS = "/events";

    private final SimpMessagingTemplate messagingTemplate;

    WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void onMessage(Message message) {
        messagingTemplate.convertAndSend(QUEUE_EVENTS, MessageEvent.fromMessage(message));
    }

    public void onChannel(Channel channel) {
        messagingTemplate.convertAndSend(QUEUE_EVENTS, ChannelEvent.builder()
                .payload(ChannelPayload.fromChannel(channel))
                .build()
        );
    }

    public void onMetadata(MetadataMap metadataMap) {
        if (metadataMap.isEmpty()) {
            return;
        }

        messagingTemplate.convertAndSend(QUEUE_EVENTS, MetadataEvent.fromMetadataMap(metadataMap));
    }
}
