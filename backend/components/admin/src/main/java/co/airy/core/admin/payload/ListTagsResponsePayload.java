package co.airy.core.admin.payload;

import co.airy.core.api.admin.payload.TagPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListTagsResponsePayload {
    private List<TagPayload> data;
}
