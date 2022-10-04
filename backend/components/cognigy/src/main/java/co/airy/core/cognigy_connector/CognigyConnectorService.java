package co.airy.core.cognigy;

import co.airy.avro.communication.Message;
import co.airy.core.cognigy.models.MessageSendResponse;
import co.airy.core.cognigy.models.MessageSend;

import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
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
public class  CognigyConnectorService {
    private final  CognigyClient  cognigyClient;

    private static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger log = AiryLoggerFactory.getLogger(CognigyConnectorService.class);
    private final MessageHandler messageHandler;
    private final String userId;

     CognigyConnectorService(MessageHandler messageHandler, CognigyClient  cognigyClient, @Value("${cognigy.userId}") String userId) {
        this.messageHandler = messageHandler;
        this.cognigyClient = cognigyClient;
        this.userId = userId;
    }

    public List<KeyValue<String, SpecificRecordBase>> send(Message userMessage) {
        final List<KeyValue<String, SpecificRecordBase>> result = new ArrayList<>();
        try {
            MessageSendResponse  cognigyResponse = this.cognigyClient.sendMessage(MessageSend.builder()
            .text(getTextFromContent(userMessage.getContent()))
            .userId(userId)
            .sessionId(userMessage.getConversationId())
            .build());
            Message message = messageHandler.getMessage(userMessage, cognigyResponse);
            result.add(KeyValue.pair(message.getId(), message));
        } catch (Exception e) {
            log.error(String.format("could not call the  Cognigy webhook for message id %s %s", userMessage.getId(), e));
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
