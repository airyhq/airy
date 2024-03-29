package co.airy.core.ibm_watson_assistant_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.ibm_watson_assistant.models.MessageSendResponse;
import co.airy.log.AiryLoggerFactory;
import co.airy.sources_parser.SourcesParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class MessageHandler {
    private final ObjectMapper mapper = new ObjectMapper();
    private static final Logger log = AiryLoggerFactory.getLogger(MessageHandler.class);

    MessageHandler() {
    }

    public Message getMessage(Message contactMessage, MessageSendResponse response) throws Exception {
        String content = getContent(contactMessage.getSource(), response);
        if (content == null) {
            throw new Exception("Unable to map IBM Watson Assistant reply to source response.");
        }

        return Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(contactMessage.getChannelId())
                .setContent(content)
                .setConversationId(contactMessage.getConversationId())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(contactMessage.getSource())
                .setSenderId("ibm-watson-assistant-bot")
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();
    }

    public String getContent(String source, MessageSendResponse response) throws JsonProcessingException {

        try {
            final JsonNode responseNode = mapper.valueToTree(response);
            String text = "";

            for (JsonNode nestedNode : responseNode.path("output").path("generic")) {
                text = nestedNode.get("text").textValue();
            }

            if (text == null) {
                return null;
            }

            return SourcesParser.mapContent(source, text, null);

            
        } catch (Exception e) {
            log.error(String.format("could not find the text node in the response %s %s", response.toString(), e));
        }

        return null;
    }
}
