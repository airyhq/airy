package co.airy.core.api.communication.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMetadata {
    private String previousCursor;
    private String nextCursor;
    private long filteredTotal;
    private long total; //total conversation count
}
