package co.airy.core.contacts.dto;

import co.airy.avro.communication.Message;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.concurrent.ConcurrentSkipListSet;

public class Messages extends ConcurrentSkipListSet<Message> {
    @JsonCreator
    public Messages() {
        super((Message c1, Message c2) -> {
            if (c1.getSentAt() == c2.getSentAt()) {
                // If messages share the same timestamp use the id
                return c1.getId().compareTo(c2.getId());
            }

            return Long.compare(c2.getSentAt(), c1.getSentAt());
        });
    }

    // TreeSet does not support updating objects
    public void update(Message message) {
        remove(message);
        add(message);
    }
}
