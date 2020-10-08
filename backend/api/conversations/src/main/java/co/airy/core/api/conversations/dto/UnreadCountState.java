package co.airy.core.api.conversations.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountState implements Serializable {
    Set<Long> messageSentDates = new HashSet<>();

    public Integer getUnreadCount() {
        return messageSentDates.size();
    }
}
