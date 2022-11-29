package co.airy.core.sources.instagram.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectInstagramRequestPayload {
    @NotNull
    private String pageId;
    @NotNull
    private String accountId;
    @NotNull
    private String pageToken;
    private String name;
    private String imageUrl;
}
