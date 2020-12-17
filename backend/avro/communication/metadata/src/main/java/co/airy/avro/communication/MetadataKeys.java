package co.airy.avro.communication;

/**
 * JSON dot notation keys for pre-defined metadata
 */
public class MetadataKeys {
    public static String PUBLIC = "public";
    public static class Source {
        public static class Contact {
            public static final String FIRST_NAME = "source.contact.first_name";
            public static final String LAST_NAME = "source.contact.last_name";
            public static final String AVATAR_URL = "source.contact.avatar_url";
        }
    }

    public static final String TAGS = "tags";
}

