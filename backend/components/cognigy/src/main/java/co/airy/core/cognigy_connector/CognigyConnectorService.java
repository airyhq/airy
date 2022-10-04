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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class  CognigyConnectorService {
    private final  CognigyClient  cognigyClient;

    //parse JSON with Jackson (=JSON processor for Java)
    private static final ObjectMapper mapper = new ObjectMapper();

    //Logger object: used to log messages for a specific system / application
    //The LoggerFactory is a utility class producing Loggers for various logging APIs, 
    //most notably for log4j, logback and JDK 1.4 logging
    private static final Logger log = AiryLoggerFactory.getLogger(CognigyConnectorService.class);
    private final MessageHandler messageHandler;

     CognigyConnectorService(MessageHandler messageHandler, CognigyClient  cognigyClient) {
        this.messageHandler = messageHandler;
        this.cognigyClient = cognigyClient;
    }

    //list in Java: sequence of elements according to an order
    //create key, value list
    //SpecificRecordBase: Avro -> Base class for generated record classes.
    public List<KeyValue<String, SpecificRecordBase>> send(Message userMessage) {
        final List<KeyValue<String, SpecificRecordBase>> result = new ArrayList<>();

        try {
            List<MessageSendResponse>  cognigyResponseList = this.cognigyClient.sendMessage(MessageSend.builder()
            .message(getTextFromContent(userMessage.getContent()))
            .sender(userMessage.getId())
            .build());
            for (MessageSendResponse  cognigyResponse:  cognigyResponseList) {
                try {
                    Message message = messageHandler.getMessage(userMessage, cognigyResponse);
                    result.add(KeyValue.pair(message.getId(), message));
                } catch (Exception e) {
                    log.info(String.format("could not handle response for data type for message id %s %s. Please inspect the",  cognigyResponse.toString(), e));
                }
            }
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
