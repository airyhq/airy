package co.airy.core.sources.meta.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LongLivingUserAccessToken {
    private String accessToken;
}

