package co.airy.core.api.communication.dto;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Comparator;
import java.util.TreeSet;

public class MessagesTreeSet extends TreeSet<MessageMetadata> {
    @JsonCreator
    public MessagesTreeSet() {
        super(Comparator.comparing((MessageMetadata message) -> message.getMessage().getSentAt()).reversed());
    }
}
