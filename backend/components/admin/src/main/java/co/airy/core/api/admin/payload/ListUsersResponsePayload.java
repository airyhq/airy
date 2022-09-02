package co.airy.core.api.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListUsersResponsePayload {
    private List<UserResponsePayload> data;
    private PaginationData paginationData;
}
