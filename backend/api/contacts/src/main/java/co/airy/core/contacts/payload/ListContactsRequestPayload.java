package co.airy.core.contacts.payload;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ListContactsRequestPayload {
    private String cursor;
    private int pageSize = 20;
}
