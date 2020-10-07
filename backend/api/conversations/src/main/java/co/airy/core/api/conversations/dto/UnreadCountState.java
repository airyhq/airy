package co.airy.core.api.conversations.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountState implements Serializable {
    HashSet<Long> messageSentDates = new HashSet<>();

    public Integer getUnreadCount() {
        return messageSentDates.size();
    }
}
