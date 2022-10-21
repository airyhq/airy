package co.airy.core.ibm_watson_assistant_connector;

import co.airy.avro.communication.Message;
import co.airy.core.ibm_watson_assistant.models.MessageSendResponse;
import co.airy.core.ibm_watson_assistant.models.MessageSend;

import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class  IBMWatsonAssistantConnectorService {
    private final  IBMWatsonAssistantClient  IBMWatsonAssistantClient;

    private static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger log = AiryLoggerFactory.getLogger(IBMWatsonAssistantConnectorService.class);
    private final MessageHandler messageHandler;
    private final String assistantId;
    
     IBMWatsonAssistantConnectorService(MessageHandler messageHandler, IBMWatsonAssistantClient  IBMWatsonAssistantClient, @Value("${ibm-watson-assistant.assistantId}") String assistantId) {
        this.messageHandler = messageHandler;
        this.IBMWatsonAssistantClient = IBMWatsonAssistantClient;
        this.assistantId = assistantId;
    }

    public List<KeyValue<String, SpecificRecordBase>> send(Message userMessage) {
        final List<KeyValue<String, SpecificRecordBase>> result = new ArrayList<>();

        ObjectMapper mapper = new ObjectMapper();
        final ObjectNode inputNode = mapper.createObjectNode();
        inputNode.put("message_type", "text");
        inputNode.put("text", getTextFromContent(userMessage.getContent()));


        try {
            MessageSendResponse  IBMWatsonAssistantResponse = this.IBMWatsonAssistantClient.sendMessage(MessageSend.builder()
            .sessionId(userMessage.getConversationId())
            .assistantId(assistantId)
            .input(inputNode)
            .build());
            Message message = messageHandler.getMessage(userMessage, IBMWatsonAssistantResponse);
            result.add(KeyValue.pair(message.getId(), message));
        } catch (Exception e) {
            log.error(String.format("could not call the  IBM Watson Assistant webhook for message id %s %s", userMessage.getId(), e));
        }
        return result;
    }

    private String getTextFromContent(String content) {
        String text = "";

        try {
            final JsonNode node = Optional.ofNullable(mapper.readTree(content)).orElseGet(mapper::createObjectNode);

            //NOTE: Tries to find the text context for text messages
            text = Optional.ofNullable(node.findValue("text")).orElseGet(mapper::createObjectNode).asText();
        } catch (JsonProcessingException e) {
            log.error(String.format("unable to parse text from content %s", content));
        }

        //NOTE: return default message when text is not found
        return Optional.ofNullable(text).filter(s -> !s.isEmpty()).orElse("New message");
    }
}
