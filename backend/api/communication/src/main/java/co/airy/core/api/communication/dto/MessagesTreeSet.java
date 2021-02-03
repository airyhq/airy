package co.airy.core.api.communication.dto;

import co.airy.model.message.dto.MessageContainer;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Comparator;
import java.util.TreeSet;

public class MessagesTreeSet extends TreeSet<MessageContainer> {
    @JsonCreator
    public MessagesTreeSet() {
        super(Comparator.comparing((MessageContainer container) -> container.getMessage().getSentAt()).reversed());
    }

    // TreeSet does not support updating objects
    public void update(MessageContainer container) {
        remove(container);
        add(container);
    }
}
