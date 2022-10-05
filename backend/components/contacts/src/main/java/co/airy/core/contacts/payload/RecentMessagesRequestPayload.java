package co.airy.core.contacts.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentMessagesRequestPayload {
    @NotNull
    private UUID contactId;
    private List<String> includeSources = new ArrayList<>();
    private int pageSize = 20;
    private Map<UUID, String> cursors = new HashMap<>();
}
