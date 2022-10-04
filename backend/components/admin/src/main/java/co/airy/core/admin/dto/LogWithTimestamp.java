package co.airy.core.admin.dto;

import co.airy.avro.ops.HttpLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogWithTimestamp implements Serializable {
    private long timestamp;
    private HttpLog log;
}
