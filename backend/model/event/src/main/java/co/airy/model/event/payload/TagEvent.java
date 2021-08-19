package co.airy.model.event.payload;

import co.airy.avro.communication.Tag;
import co.airy.core.api.admin.payload.TagPayload;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TagEvent extends Event implements Serializable {
    private TagPayload payload;
    private Long timestamp;

    public static TagEvent fromTag(Tag tag) {
        return builder()
                .timestamp(Instant.now().toEpochMilli()) // TODO record channel update date
                .payload(TagPayload.fromTag(tag)).build();
    }

    @Override
    public EventType getTypeId() {
        return EventType.TAG_UPDATED;
    }
}
