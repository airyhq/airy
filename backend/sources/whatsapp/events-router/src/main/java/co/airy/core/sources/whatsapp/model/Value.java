package co.airy.core.sources.whatsapp.model;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// See https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Value {
    private String messagingProduct;
    private Metadata metadata;
    private List<Contact> contacts;
    private List<JsonNode> messages;

    // TODO
    // private JsonNode statuses;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metadata {
        private String displayPhoneNumber;
        private String phoneNumberId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Contact {
        private Profile profile;
        private String waId;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Profile {
            private String name;
        }
    }
}
