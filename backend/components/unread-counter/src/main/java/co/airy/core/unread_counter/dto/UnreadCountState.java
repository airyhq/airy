package co.airy.core.unread_counter.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountState implements Serializable {
    @Builder.Default
    private Map<String, Long> unreadMessagesSentAt = new ConcurrentHashMap<>();
    @Builder.Default
    private Map<String, Long> messagesReadAt = new ConcurrentHashMap<>();

    @JsonIgnore
    public Integer getUnreadCount() {
        return unreadMessagesSentAt.size();
    }

    // Moves unread messages before the read date to the map of read messages
    public void markMessagesReadAfter(long timestamp) {
        cleanUpReadMap(timestamp);

        final Iterator<Map.Entry<String, Long>> iterator = unreadMessagesSentAt.entrySet().iterator();
        while (iterator.hasNext()) {
            final Map.Entry<String, Long> entry = iterator.next();
            if (entry.getValue() < timestamp) {
                messagesReadAt.put(entry.getKey(), entry.getValue());
                iterator.remove();
            }
        }
    }

    /*
     Records in messagesReadAt needs to expire for two reasons:
     - Aggregation objects can exceed producer write buffer if they grow without bounds
     - We would keep writing user_read metadata for each message indefinitely

     Expiry should optimally happen once we know the metadata has been produced once.
     Ensuring this is not feasible with Kafka Streams so we opt for a conservative TTL (30s).
    */
    private void cleanUpReadMap(long timestamp) {
        messagesReadAt.values().removeIf(readAt -> timestamp - readAt > 30_000);
    }
}
