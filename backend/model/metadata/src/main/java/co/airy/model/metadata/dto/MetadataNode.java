package co.airy.model.metadata.dto;

import co.airy.avro.communication.ValueType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetadataNode implements Serializable {
    private String key;
    private String value;
    private ValueType valueType;
}
