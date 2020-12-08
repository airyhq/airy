package co.airy.core.api.communication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Objects;

@Data
@Builder
@AllArgsConstructor
public class DisplayName {
    private String firstName;
    private String lastName;

    public String toString() {
        return String.format("%s %s", Objects.toString(firstName, ""), Objects.toString(lastName, "")).trim();
    }
}
