package co.airy.core.rasa_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.rasa_connector.models.MessageSendResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Service;
import co.airy.sources_parser.SourcesParser;


import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class MessageHandler {

    MessageHandler() {
    }

    public Message getMessage(Message contactMessage, MessageSendResponse response) throws Exception {
        String content = getContent(contactMessage.getSource(), response);
        if (content == null) {
            throw new Exception("Unable to map rasa reply to source response.");
        }

        return Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(contactMessage.getChannelId())
                .setContent(content)
                .setConversationId(contactMessage.getConversationId())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(contactMessage.getSource())
                .setSenderId("rasa-bot")
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();
    }

   

    public String getContent(String source, MessageSendResponse response) throws JsonProcessingException {
        final String text = response.getText();
        final String image = response.getImage();

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode rootNode = mapper.createObjectNode();
        ObjectNode childNode1 = mapper.createObjectNode();
        ObjectNode childNode2 = mapper.createObjectNode();

        if (text == null && image == null) {
            return null;
        }

        if(image != null){
            childNode1.put("type", "image");
            childNode2.put("url", image);
            childNode1.put("payload", childNode2);
            rootNode.put("attachment", childNode1);
            JsonNode imageJsonNode = mapper.convertValue(rootNode, JsonNode.class);

            return SourcesParser.mapContent(source, text, imageJsonNode);
        } else {
            return SourcesParser.mapContent(source, text, null);
        }

       
    }

}
