package co.airy.core.contacts.payload;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MergeContactsRequestPayload {
    @NotNull
    private UUID sourceId;

    @NotNull
    private UUID destinationId;
}
