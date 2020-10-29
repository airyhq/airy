package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ContactResponsePayload {
    private String avatarUrl;
    private String firstName;
    private String lastName;
    private Map<String, String> info;
}

