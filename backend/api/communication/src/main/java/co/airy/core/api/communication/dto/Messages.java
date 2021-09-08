package co.airy.core.api.communication.dto;

import co.airy.model.message.dto.MessageContainer;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.concurrent.ConcurrentSkipListSet;

public class Messages extends ConcurrentSkipListSet<MessageContainer> {
    @JsonCreator
    public Messages() {
        super((MessageContainer c1, MessageContainer c2) -> {
            if (c1.getMessage().getSentAt() == c2.getMessage().getSentAt()) {
                // If messages share the same timestamp
                return c1.getMessage().getId().compareTo(c2.getMessage().getId());
            }

            return Long.compare(c2.getMessage().getSentAt(), c1.getMessage().getSentAt());
        });
    }

    // TreeSet does not support updating objects
    public void update(MessageContainer container) {
        remove(container);
        add(container);
    }
}
