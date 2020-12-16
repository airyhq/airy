package co.airy.core.sources.facebook.model;

import co.airy.avro.communication.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation implements Serializable {
    private String sourceConversationId;
    private String channelId;
    private Channel channel;
    private Map<String, String> metadata;
}
