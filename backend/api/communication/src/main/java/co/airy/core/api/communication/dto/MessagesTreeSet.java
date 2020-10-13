package co.airy.core.api.communication.dto;

import co.airy.avro.communication.Message;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Comparator;
import java.util.TreeSet;

public class MessagesTreeSet extends TreeSet<Message> {
    @JsonCreator
    public MessagesTreeSet() {
        super(Comparator.comparing(Message::getSentAt));
    }
}
