package co.airy.model.metadata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@Data
@AllArgsConstructor
public class Subject {
    @NonNull
    private final String namespace;
    private final String identifier;

    public String toString() {
        if (identifier == null) {
            return namespace;
        }
        return String.format("%s:%s", namespace, identifier);
    }
}
