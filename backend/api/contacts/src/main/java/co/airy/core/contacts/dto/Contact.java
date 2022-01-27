package co.airy.core.contacts.dto;

import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.dto.MetadataMap;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static co.airy.core.contacts.MetadataRepository.newContactMetadata;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.ADDRESS;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.AVATAR_URL;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.CONVERSATIONS;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.CREATED_AT;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.DISPLAY_NAME;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.GENDER;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.LOCALE;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.ORGANIZATION_NAME;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.MERGE_HISTORY;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.TIMEZONE;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.TITLE;
import static co.airy.core.contacts.dto.Contact.MetadataKeys.VIA;
import static co.airy.model.metadata.MetadataRepository.getSubject;
import static java.util.stream.Collectors.toMap;

@Data
@Builder(toBuilder = true)
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
    private List<Contact> mergeHistory;

    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address implements Serializable {
        private String organizationName;
        private String addressLine1;
        private String addressLine2;
        private String postalCode;
        private String city;
        private String state;
        private String country;

        public static Address fromMetadataMap(MetadataMap map) {
            if (map == null) {
                return null;
            }
            return Address.builder()
                    .organizationName(map.getMetadataValue(MetadataKeys.Address.ORGANIZATION_NAME))
                    .addressLine1(map.getMetadataValue(MetadataKeys.Address.ADDRESS_LINE1))
                    .addressLine2(map.getMetadataValue(MetadataKeys.Address.ADDRESS_LINE2))
                    .city(map.getMetadataValue(MetadataKeys.Address.CITY))
                    .state(map.getMetadataValue(MetadataKeys.Address.STATE))
                    .postalCode(map.getMetadataValue(MetadataKeys.Address.POSTAL_CODE))
                    .country(map.getMetadataValue(MetadataKeys.Address.COUNTRY))
                    .build();
        }

        @JsonIgnore
        public Address merge(Address address) {
            if (address == null) {
                return this.toBuilder().build();
            }

            return this.toBuilder()
                    .addressLine1(Optional.ofNullable(this.getAddressLine1()).orElse(address.getAddressLine1()))
                    .addressLine2(Optional.ofNullable(this.getAddressLine2()).orElse(address.getAddressLine2()))
                    .city(Optional.ofNullable(this.getCity()).orElse(address.getCity()))
                    .country(Optional.ofNullable(this.getCountry()).orElse(address.getCountry()))
                    .postalCode(Optional.ofNullable(this.getPostalCode()).orElse(address.getPostalCode()))
                    .organizationName(Optional.ofNullable(this.getOrganizationName()).orElse(address.getOrganizationName()))
                    .build();
        }

        @JsonIgnore
        public List<Metadata> toMetadata(String contactId) {
            List<Metadata> metadata = new ArrayList<>();
            if (organizationName != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.ORGANIZATION_NAME, organizationName));
            }
            if (addressLine1 != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.ADDRESS_LINE1, addressLine1));
            }
            if (addressLine2 != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.ADDRESS_LINE2, addressLine2));
            }
            if (city != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.CITY, city));
            }
            if (state != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.STATE, state));
            }
            if (postalCode != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.POSTAL_CODE, postalCode));
            }
            if (country != null) {
                metadata.add(newContactMetadata(contactId, MetadataKeys.Address.COUNTRY, country));
            }
            return metadata;
        }
    }

    private Long createdAt;
    private Long updatedAt;

    public static class MetadataKeys {
        public static String ID = "id";
        public static String CREATED_AT = "created_at";
        public static String DISPLAY_NAME = "displayName";
        public static String AVATAR_URL = "avatarUrl";
        public static String TITLE = "title";
        public static String GENDER = "gender";
        public static String TIMEZONE = "timezone";
        public static String LOCALE = "locale";
        public static String ORGANIZATION_NAME = "organizationName";
        public static String VIA = "via";
        public static String CONVERSATIONS = "conversations";
        public static String METADATA = "metadata";
        public static String MERGE_HISTORY = "mergeHistory";

        public static String ADDRESS = "address";

        public static class Address {
            public static String ORGANIZATION_NAME = "address.organizationName";
            public static String ADDRESS_LINE1 = "address.address_line1";
            public static String ADDRESS_LINE2 = "address.address_line2";
            public static String POSTAL_CODE = "address.postal_code";
            public static String CITY = "address.city";
            public static String STATE = "address.state";
            public static String COUNTRY = "address.country";
        }
    }

    @JsonIgnore
    public List<Metadata> deleteAllMetadata() {
        // Using kafka tombstones to delete all contact's metadata
        return toMetadata().stream()
            .map((m) -> {
                m.setValue("");
                return m;
            })
            .collect(Collectors.toList());
    }

    @JsonIgnore
    public Contact merge(Contact c) {
        // Concatenate merge history of both contacts
        final List<Contact> history = Stream.concat(
                Optional.ofNullable(this.getMergeHistory()).orElseGet(Collections::emptyList).stream(),
                Optional.ofNullable(c.getMergeHistory()).orElseGet(Collections::emptyList).stream())
            .collect(Collectors.toList());

        // Add source contact in this case c (without its history) to the history list.
        history.add(c.toBuilder().mergeHistory(null).build());

        return this.toBuilder()
                .metadata(Optional.ofNullable(this.getMetadata()).orElse(c.getMetadata()))
                .address(Optional.ofNullable(this.getAddress()).orElseGet(Address::new).merge(c.getAddress()))
                // Aggregate conversations
                .conversations(Stream.concat(
                            Optional.ofNullable(this.getConversations()).orElseGet(Collections::emptyMap).entrySet().stream(),
                            Optional.ofNullable(c.getConversations()).orElseGet(Collections::emptyMap).entrySet().stream())
                        .collect(toMap(Map.Entry::getKey, Map.Entry::getValue)))
                .displayName(Optional.ofNullable(this.getDisplayName()).orElse(c.getDisplayName()))
                .avatarUrl(Optional.ofNullable(this.getAvatarUrl()).orElse(c.getAvatarUrl()))
                .gender(Optional.ofNullable(this.getGender()).orElse(c.getGender()))
                .locale(Optional.ofNullable(this.getLocale()).orElse(c.getLocale()))
                .organizationName(Optional.ofNullable(this.getOrganizationName()).orElse(c.getOrganizationName()))
                .timezone(Optional.ofNullable(this.getTimezone()).orElse(c.getTimezone()))
                .title(Optional.ofNullable(this.getTitle()).orElse(c.getTitle()))
                .via(Optional.ofNullable(this.getVia()).orElse(c.getVia()))
                // Aggregate mergehistory
                .mergeHistory(history)
                .build();
    }


    @JsonIgnore
    public List<Metadata> toMetadata() {
        List<Metadata> metadata = new ArrayList<>();
        if (displayName != null) {
            metadata.add(newContactMetadata(id, DISPLAY_NAME, displayName));
        }
        if (createdAt != null) {
            metadata.add(newContactMetadata(id, CREATED_AT, createdAt.toString()));
        }
        if (avatarUrl != null) {
            metadata.add(newContactMetadata(id, AVATAR_URL, avatarUrl));
        }
        if (title != null) {
            metadata.add(newContactMetadata(id, TITLE, title));
        }
        if (gender != null) {
            metadata.add(newContactMetadata(id, GENDER, gender));
        }
        if (timezone != null) {
            metadata.add(newContactMetadata(id, TIMEZONE, timezone.toString()));
        }
        if (locale != null) {
            metadata.add(newContactMetadata(id, LOCALE, locale));
        }
        if (organizationName != null) {
            metadata.add(newContactMetadata(id, ORGANIZATION_NAME, organizationName));
        }
        if (via != null && !via.isEmpty()) {
            via.forEach((key, value) -> metadata.add(newContactMetadata(id, VIA + "." + key, value)));
        }
        if (conversations != null && !conversations.isEmpty()) {
            conversations.forEach((key, value) -> metadata.add(newContactMetadata(id, CONVERSATIONS + "." + key, value)));
        }
        if (address != null) {
            metadata.addAll(address.toMetadata(id));
        }
        if (mergeHistory != null && !mergeHistory.isEmpty()) {
            try {
                final ObjectMapper mapper = new ObjectMapper();
                mapper.setSerializationInclusion(Include.NON_NULL);
                final String mergeHistoryBlob = mapper.writeValueAsString(mergeHistory);

                metadata.add(newContactMetadata(id, MERGE_HISTORY, mergeHistoryBlob));
            } catch (JsonProcessingException e) {
                //FIXME: not sure what to do here
            }
        }

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

        final Map<String, String> via = values.stream().filter(metadata -> metadata.getKey().startsWith(VIA))
                .collect(toMap(metadata -> metadata.getKey().substring(metadata.getKey().lastIndexOf('.') + 1), Metadata::getValue));

        final boolean hasAddress = values.stream().anyMatch(metadata -> metadata.getKey().startsWith(ADDRESS));

        final String mergeHistoryBlob = map.getMetadataValue(MERGE_HISTORY);
        List<Contact> mergeHistory = null;
        if (mergeHistoryBlob != null && mergeHistoryBlob != "") {
            try {
                final ObjectMapper mapper = new ObjectMapper();

                mergeHistory = mapper.readValue(
                        mergeHistoryBlob,
                        new TypeReference<List<Contact>>() {});
            } catch (JsonProcessingException e) {
                //FIXME: not sure what to do here
            }
        }

        return Contact.builder()
                .id(id)
                .updatedAt(map.getUpdatedAt())
                .createdAt(Optional.ofNullable(map.get(CREATED_AT)).map(Metadata::getTimestamp).orElse(null))
                .displayName(map.getMetadataValue(DISPLAY_NAME))
                .avatarUrl(map.getMetadataValue(AVATAR_URL))
                .title(map.getMetadataValue(TITLE))
                .gender(map.getMetadataValue(GENDER))
                .timezone(parseOrNull(map.getMetadataValue(TIMEZONE)))
                .locale(map.getMetadataValue(LOCALE))
                .organizationName(map.getMetadataValue(ORGANIZATION_NAME))
                .via(via.size() > 0 ? via : null)
                .address(hasAddress ? Address.fromMetadataMap(map) : null)
                .conversations(conversations.size() > 0 ? conversations : null)
                .mergeHistory(mergeHistory)
                .build();
    }

    private static Integer parseOrNull(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
