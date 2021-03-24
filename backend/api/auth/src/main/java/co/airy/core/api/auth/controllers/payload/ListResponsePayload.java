package co.airy.core.api.auth.controllers.payload;

import lombok.Data;

import java.util.List;

@Data
public class ListResponsePayload {
    private List<UserPayload> data;
}
