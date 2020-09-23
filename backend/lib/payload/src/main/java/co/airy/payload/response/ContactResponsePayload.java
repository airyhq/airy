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
    public String avatarUrl;

    public String firstName;

    public String lastName;

    public Map<String, String> info;
}

