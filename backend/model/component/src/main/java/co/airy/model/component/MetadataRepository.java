package co.airy.model.component;

import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.Subject;

import java.time.Instant;

public class MetadataRepository {
    public static Metadata newComponentMetadata(String componentName, String key, String value) {
        return Metadata.newBuilder()
                .setSubject(new Subject("component", componentName).toString())
                .setKey(key)
                .setValue(value)
                .setTimestamp(Instant.now().toEpochMilli())
                .build();
    }
}
