package co.airy.core.sources.whatsapp.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageResponse {
    private String messagingProduct;
    private List<Contact> contacts;
    private List<Message> messages;

    public String getMessageId() {
        if (messages != null && messages.size() > 0) {
            return messages.get(0).getId();
        }
        return null;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Contact {
        private String input;
        private String waId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String id;
    }
}

