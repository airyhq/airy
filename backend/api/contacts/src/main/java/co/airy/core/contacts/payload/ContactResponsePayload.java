package co.airy.core.contacts.payload;

import co.airy.core.contacts.dto.Contact;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponsePayload {
    private String id;
    private String displayName;
    private String avatarUrl;
    private String title;
    private String gender;
    private Integer timezone;
    private String locale;
    private String organizationName;
    private Map<String, String> via;
    private Contact.Address address;
    private Map<UUID, String> conversations;
    private JsonNode metadata;
    private Long createdAt;
    private Long updatedAt;

    public static ContactResponsePayload fromContact(Contact contact) {
        return ContactResponsePayload.builder()
                .id(contact.getId())
                .displayName(contact.getDisplayName())
                .avatarUrl(contact.getAvatarUrl())
                .title(contact.getTitle())
                .gender(contact.getGender())
                .timezone(contact.getTimezone())
                .locale(contact.getLocale())
                .organizationName(contact.getOrganizationName())
                .via(contact.getVia())
                .address(contact.getAddress())
                .conversations(contact.getConversations())
                .metadata(contact.getMetadata())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }

    private static String getValue(String value) {
        // "" is null
        return "".equals(value) ? null : value;
    }
}
