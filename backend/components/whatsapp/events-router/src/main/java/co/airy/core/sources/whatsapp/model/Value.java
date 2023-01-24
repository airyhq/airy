package co.airy.core.sources.whatsapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("whatsapp_business_api_data")
    private Value whatsappBusinessApiData;

    private String messagingProduct;
    private Metadata metadata;
    private List<Contact> contacts;
    private List<JsonNode> messages;

    private JsonNode statuses;

    private String displayPhoneNumber;
    private String phoneNumberId;

    public String getDisplayPhoneNumber() {
        return metadata != null ? metadata.getDisplayPhoneNumber() : displayPhoneNumber;
    }

    public String getPhoneNumberId() {
        return metadata != null ? metadata.getPhoneNumberId() : phoneNumberId;
    }

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
