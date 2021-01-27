package co.airy.core.api.communication.dto;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Comparator;
import java.util.TreeSet;

public class MessagesTreeSet extends TreeSet<MessageWrapper> {
    @JsonCreator
    public MessagesTreeSet() {
        super(Comparator.comparing((MessageWrapper wrapper) -> wrapper.getMessage().getSentAt()).reversed());
    }

    // TreeSet does not support updating objects
    public void update(MessageWrapper wrapper) {
        remove(wrapper);
        add(wrapper);
    }
}
