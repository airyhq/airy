package co.airy.core.api.admin.payload;

import co.airy.avro.communication.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagPayload {
    private String id;
    private String name;
    private String color;

    public static TagPayload fromTag(Tag tag) {
        return TagPayload.builder()
                .id(tag.getId())
                .color(tag.getColor().toString())
                .name(tag.getName())
                .build();
    }
}
