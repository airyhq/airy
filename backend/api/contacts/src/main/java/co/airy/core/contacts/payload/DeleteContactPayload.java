package co.airy.core.contacts.payload;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@NoArgsConstructor
public class DeleteContactPayload {
    @NotNull
    private UUID id;
}

