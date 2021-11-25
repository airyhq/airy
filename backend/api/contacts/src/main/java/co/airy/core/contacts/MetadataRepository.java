package co.airy.core.contacts;

import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.Subject;

import java.time.Instant;

public class MetadataRepository {
    public static Metadata newContactMetadata(String contactId, String key, String value) {
        return Metadata.newBuilder()
                .setSubject(new Subject("contact", contactId).toString())
                .setKey(key)
                .setValue(value)
                .setTimestamp(Instant.now().toEpochMilli())
                .build();
    }
}
