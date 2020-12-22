package co.airy.core.sources.facebook.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectRequestPayload {
    @NotNull
    private String pageId;
    @NotNull
    private String pageToken;
    @NotNull
    private String name;
    private String imageUrl;
}
