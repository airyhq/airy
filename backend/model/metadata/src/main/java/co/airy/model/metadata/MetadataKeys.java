package co.airy.model.metadata;

/**
 * JSON dot notation keys for pre-defined metadata
 */
public class MetadataKeys {
    public static String USER_DATA = "user_data";
    public static class ConversationKeys {
        public static final String TAGS = "tags";
        public static final String UNREAD_COUNT = "unread_count";
        public static final String STATE = "state";
        public static final String LANGUAGE = "language";

        public static final String CONTACT = "contact";

        public static class Contact {
            public static final String DISPLAY_NAME = "contact.display_name";
            public static final String AVATAR_URL = "contact.avatar_url";
            public static final String LANGUAGE = "contact.lang";
            public static final String COUNTRY = "contact.country";

            public static final String FETCH_STATE = "contact.fetch_state";
        }

        public enum ContactFetchState {
            ok("ok"),
            failed("failed");

            private final String state;

            ContactFetchState(final String state) {
                this.state = state;
            }

            @Override
            public String toString() {
                return state;
            }
        }
    }

    public static class ChannelKeys {
        public static final String NAME = "name";
        public static final String IMAGE_URL = "image_url";
    }

    public static class MessageKeys {
        public static final String SUGGESTIONS = "suggestions";
        public static final String ERROR = "error";
        public static final String LANGUAGE = "language";

        public static class Source {
            public static final String ID = "source.id";
            public static final String DELIVERY_STATE = "source.delivery_state";
            public static final String ERROR = "source.error";
        }

        public static class Reaction {
            public static final String EMOJI = "reaction.emoji";
            public static final String SENT_AT = "reaction.sent_at";
        }
    }
}

