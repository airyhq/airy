package co.airy.core.sources.whatsapp.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LongLivingUserAccessToken {
    private String accessToken;
}

