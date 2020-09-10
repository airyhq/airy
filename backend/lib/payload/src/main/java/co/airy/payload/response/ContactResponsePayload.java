package backend.lib.payload.src.main.java.co.airy.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ContactResponsePayload implements Serializable {

    public String id;

    public String avatarUrl;

    public String firstName;

    public String lastName;

    public Map<String, String> info;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Set<ContactTagResponsePayload> tags;
}

