package co.airy.core.api.components.installer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Repository {

    private String name;
    private String url;
    private String username;
    private String password;
}
