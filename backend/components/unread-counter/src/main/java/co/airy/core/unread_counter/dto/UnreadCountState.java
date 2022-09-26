package co.airy.core.unread_counter.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountState implements Serializable {
    @Builder.Default
    private Map<String, Long> unreadMessagesSentAt = new HashMap<>();
    // TODO this can grow without bounds so records need to expire
    @Builder.Default
    private Map<String, Long> messagesReadAt = new HashMap<>();

    @JsonIgnore
    public Integer getUnreadCount() {
        return unreadMessagesSentAt.size();
    }

    // Moves unread messages before the read date to the map of read messages
    public void markMessagesReadAfter(long timestamp) {
        this.cleanUpReadMap(timestamp);

        for (Map.Entry<String, Long> entry : unreadMessagesSentAt.entrySet()) {
            if (entry.getValue() < timestamp) {
                messagesReadAt.put(entry.getKey(), entry.getValue());
                unreadMessagesSentAt.remove(entry.getKey());
            }
        }
    }

    /*
     Records in messagesReadAt needs to expire for two reasons:
     - Aggregation objects can exceed producer write buffer if they grow unboundedly
     - We would keep writing user_read metadata for each message indefinitely

     Expiry should optimally happen once we know the metadata has been produced once.
     Ensuring this is not feasible with Kafka Streams so we opt for a conservative TTL (30s).
    */
    private void cleanUpReadMap(long timestamp) {
        for (Map.Entry<String, Long> entry : messagesReadAt.entrySet()) {
            if (timestamp  - entry.getValue() > 30_000) {
                messagesReadAt.remove(entry.getKey());
            }
        }
    }
}
