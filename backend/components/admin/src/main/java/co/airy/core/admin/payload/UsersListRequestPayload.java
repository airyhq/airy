package co.airy.core.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsersListRequestPayload {
    private String cursor;
    private Integer pageSize = 20;
}
