package co.airy.core.contacts.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImportContactsResponsePayload {
    private List<ContactResponsePayload> data;
}
