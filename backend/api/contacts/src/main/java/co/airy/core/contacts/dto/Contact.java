package co.airy.core.contacts.dto;

import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static co.airy.core.contacts.MetadataRepository.newContactMetadata;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.AVATAR_URL;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.CONVERSATIONS;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.DISPLAY_NAME;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.TITLE;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.VIA;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static java.util.stream.Collectors.toMap;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Contact implements Serializable {
    private String id;
    private String displayName;
    private String avatarUrl;
    private String title;
    private String gender;
    private Integer timezone;
    private String locale;
    private String organizationName;
    private Map<String, String> via;
    private Address address;
    private Map<UUID, String> conversations;
    private JsonNode metadata;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address implements Serializable {
        private String organizationName;
        private String addressLine1;
        private String addressLine2;
        private String zip;
        private String city;
        private String state;
        private String country;
    }

    private Long createdAt;
    private Long updatedAt;

    public static class MetadataKeys {
        public static String ID = "id";
        public static String DISPLAY_NAME = "displayName";
        public static String AVATAR_URL = "avatarUrl";
        public static String TITLE = "title";
        public static String GENDER = "gender";
        public static String TIMEZONE = "timezone";
        public static String LOCALE = "locale";
        public static String ORGANIZATION_NAME = "organizationName";
        public static String VIA = "VIA";
        public static String ADDRESS = "ADDRESS";
        public static String CONVERSATIONS = "CONVERSATIONS";
        public static String METADATA = "METADATA";

    }


    @JsonIgnore
    public List<Metadata> toMetadata() {
        List<Metadata> metadata = new ArrayList<>();
        if (displayName != null) {
            metadata.add(newContactMetadata(id, DISPLAY_NAME, displayName));
        }
        if (avatarUrl != null) {
            metadata.add(newContactMetadata(id, AVATAR_URL, avatarUrl));
        }
        if (title != null) {
            metadata.add(newContactMetadata(id, TITLE, title));
        }
        if (via != null && !via.isEmpty()) {
            via.forEach((key, value) -> metadata.add(newContactMetadata(id, VIA + "." + key, value)));
        }
        if (conversations != null && !conversations.isEmpty()) {
            conversations.forEach((key, value) -> metadata.add(newContactMetadata(id, CONVERSATIONS + "." + key, value)));
        }
        // TODO
        return metadata;
    }

    public static Contact fromMetadataMap(MetadataMap map) {
        if (map == null) {
            return null;
        }
        final Collection<Metadata> values = map.values();

        final Optional<Metadata> anyRecord = values.stream().findAny();
        if (anyRecord.isEmpty()) {
            return null;
        }

        final String id = getSubject(anyRecord.get()).getIdentifier();

        final Map<UUID, String> conversations = values.stream().filter(metadata -> metadata.getKey().startsWith(CONVERSATIONS))
                .collect(toMap(metadata -> UUID.fromString(metadata.getKey().substring(metadata.getKey().lastIndexOf('.') + 1)), Metadata::getValue));

        return Contact.builder()
                .id(id)
                // TODO
                .displayName(map.getMetadataValue(DISPLAY_NAME))
                .avatarUrl(map.getMetadataValue(AVATAR_URL))
                .title(map.getMetadataValue(TITLE))
                .conversations(conversations.size() > 0 ? conversations : null)
                .build();
    }
}
