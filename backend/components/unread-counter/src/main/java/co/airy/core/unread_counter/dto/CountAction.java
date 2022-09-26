package co.airy.core.unread_counter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CountAction implements Serializable {
    public enum ActionType {
        INCREMENT,
        RESET
    }

    private ActionType actionType;
    private long timestamp;
    private String messageId;

    public static CountAction reset(long timestamp) {
        return new CountAction(ActionType.RESET, timestamp, null);
    }

    public static CountAction increment(long timestamp, String messageId) {
        return new CountAction(ActionType.INCREMENT, timestamp, messageId);
    }
}
