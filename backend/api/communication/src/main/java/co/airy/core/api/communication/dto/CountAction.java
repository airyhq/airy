package co.airy.core.api.communication.dto;

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
    private long readDate;

    public static CountAction reset(long readDate) {
        return new CountAction(ActionType.RESET, readDate);
    }

    public static CountAction increment(long readDate) {
        return new CountAction(ActionType.INCREMENT, readDate);
    }
}
