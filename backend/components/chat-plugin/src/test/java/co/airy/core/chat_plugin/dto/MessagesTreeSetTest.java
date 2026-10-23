package co.airy.core.chat_plugin.dto;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MessagesTreeSetTest {
    @Test
    void retainsDistinctMessagesWithSameTimestampAndReplacesUpdatesById() {
        final MessagesTreeSet messages = new MessagesTreeSet();
        final long sentAt = 1_700_000_000_000L;
        final Message first = message("synthetic-a", sentAt, DeliveryState.PENDING);
        final Message second = message("synthetic-b", sentAt, DeliveryState.DELIVERED);

        messages.update(first);
        messages.update(second);
        assertEquals(2, messages.size());

        final Message updatedFirst = message("synthetic-a", sentAt, DeliveryState.DELIVERED);
        messages.update(updatedFirst);

        assertEquals(2, messages.size());
        assertEquals(DeliveryState.DELIVERED, messages.stream()
                .filter(message -> message.getId().equals("synthetic-a"))
                .findFirst()
                .orElseThrow()
                .getDeliveryState());
    }

    private Message message(String id, long sentAt, DeliveryState deliveryState) {
        return Message.newBuilder()
                .setId(id)
                .setIsFromContact(true)
                .setDeliveryState(deliveryState)
                .setSenderId("synthetic-sender")
                .setConversationId("synthetic-conversation")
                .setChannelId("synthetic-channel")
                .setSource("chatplugin")
                .setContent("synthetic-content")
                .setSentAt(sentAt)
                .build();
    }
}
