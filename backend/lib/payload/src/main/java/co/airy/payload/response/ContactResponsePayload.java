package co.airy.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ContactResponsePayload implements Serializable {
    private String avatarUrl;
    private String firstName;
    private String lastName;
    private Map<String, String> info;
}

