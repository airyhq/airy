package co.airy.core.sources.facebook.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LongLivingUserAccessToken {
    private String accessToken;
}

