package co.airy.core.contacts.payload;

import co.airy.model.contact.Contact;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateContactPayload {
    private String displayName;
    private String avatarUrl;
    private String title;
    private String gender;
    private Integer timezone;
    private String locale;
    private String organizationName;
    private Map<String, String> via;
    @Valid
    private Contact.Address address;
    private Map<UUID, String> conversations;
    private JsonNode metadata;
}
