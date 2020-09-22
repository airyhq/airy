package co.airy.core.api.conversations.dto;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation implements Serializable {
    HashSet<Participant> participants;
    Long lastOffset;

    String displayName;
    String channelId;
    Long unreadMessageCount;

    Message lastMessage;
    Channel channel;
    Map<String, String> metadata;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Participant implements Serializable {
        String senderId;
        SenderType senderType;
    }
}

