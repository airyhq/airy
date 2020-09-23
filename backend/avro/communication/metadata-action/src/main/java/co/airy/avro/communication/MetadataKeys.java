package co.airy.avro.communication;

/**
 * JSON dot notation keys for pre-defined metadata
 */
public class MetadataKeys {

    public static class SOURCE {
        public static class CONTACT {
            public static final String firstName = "source.contact.first_name";
            public static final String lastName = "source.contact.last_name";
            public static final String avatarUrl = "source.contact.avatar_url";
        }
    }
}
