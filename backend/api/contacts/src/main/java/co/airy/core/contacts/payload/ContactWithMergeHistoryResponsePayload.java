package co.airy.core.contacts.payload;

import co.airy.core.contacts.dto.Contact;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactWithMergeHistoryResponsePayload {
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
    private List<ContactResponsePayload> mergeHistory;

    public static ContactWithMergeHistoryResponsePayload fromContact(Contact contact) {
        return ContactWithMergeHistoryResponsePayload.builder()
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
                .mergeHistory(Optional.ofNullable(contact.getMergeHistory())
                    .orElseGet(Collections::emptyList)
                    .stream()
                    .map((mc) -> ContactResponsePayload.fromContact(mc))
                    .collect(Collectors.toList()))
                .build();
    }
}
