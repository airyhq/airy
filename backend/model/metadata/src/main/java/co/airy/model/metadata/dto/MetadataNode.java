package co.airy.model.metadata.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class MetadataNode implements Serializable {
    private String key;
    private String value;

    public enum ValueType {
        STRING,
        NUMBER,
        OBJECT
    }

    public ValueType getValueType() {
        if (key.endsWith("count")) {
            return ValueType.NUMBER;
        } else if (key.endsWith("content")) {
            return ValueType.OBJECT;
        }

        return ValueType.STRING;
    }
}
