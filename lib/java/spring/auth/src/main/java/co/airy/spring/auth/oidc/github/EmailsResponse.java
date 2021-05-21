package co.airy.spring.auth.oidc.github;

import lombok.Data;

@Data
public class EmailsResponse {
    private String email;
    private Boolean primary;
    private Boolean verified;
}
