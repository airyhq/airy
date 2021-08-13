package co.airy.model.event.payload;

import co.airy.avro.communication.Tag;
import co.airy.core.api.admin.payload.TagPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TagEvent extends Event implements Serializable {
    private TagPayload payload;

    public static TagEvent fromTag(Tag tag) {
        return builder().payload(TagPayload.fromTag(tag)).build();
    }

    @Override
    public EventType getType() {
        return EventType.TAG_UPDATED;
    }
}
