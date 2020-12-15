package co.airy.avro.communication;

import co.airy.uuid.UUIDv5;

import java.time.Instant;
import java.util.UUID;

public class MetadataRepository {
    public static Metadata newConversationMetadata(String conversationId, String key, String value) {
        return Metadata.newBuilder()
                .setSubject(new Subject("conversation",conversationId).toString())
                .setKey(key)
                .setValue(value)
                .setTimestamp(Instant.now().toEpochMilli())
                .build();
    }

    public static boolean isConversationMetadata(Metadata metadata) {
        return metadata.getSubject().startsWith("conversation:");
    }

    public static Metadata newConversationTag(String conversationId, String tagId) {
        return Metadata.newBuilder()
                .setSubject(new Subject("conversation",conversationId).toString())
                .setKey(String.format("%s.%s", MetadataKeys.TAGS, tagId))
                .setValue("")
                .setTimestamp(Instant.now().toEpochMilli())
                .build();
    }

    public static Subject getSubject(Metadata metadata) {
        final String subjectString = metadata.getSubject();
        int lastIndexOf = subjectString.lastIndexOf(":");

        // You do not have to pass an identifier if the namespace you want to
        // use metadata for consists of a single object
        if (lastIndexOf == -1) {
            return new Subject(subjectString, null);
        }

        String namespace = subjectString.substring(0, lastIndexOf);
        String identifier = subjectString.substring(lastIndexOf + 1);
        return new Subject(namespace, identifier);
    }

    public static UUID getId(Metadata metadata) {
        return UUIDv5.fromNamespaceAndName(metadata.getSubject(), metadata.getKey());
    }
    public static UUID getId(Subject subject, String key) {
        return UUIDv5.fromNamespaceAndName(subject.toString(), key);
    }
}
