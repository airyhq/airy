package co.airy.core.api.websocket;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.api.websocket.payload.MessageEvent;
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
        // TODO
    }
    public void onMetadata(Metadata metadata) {
        // TODO
    }
}
