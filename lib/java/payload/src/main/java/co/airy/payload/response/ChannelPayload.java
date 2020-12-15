package co.airy.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChannelPayload {
    private String id;

    @JsonInclude(NON_NULL)
    private String name;

    @JsonInclude(NON_NULL)
    private String source;

    @JsonInclude(NON_NULL)
    private String sourceChannelId;

    @JsonInclude(NON_NULL)
    private String imageUrl;
}