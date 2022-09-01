package co.airy.core.rasa_connector;

import co.airy.avro.communication.Message;
import co.airy.core.rasa_connector.models.MessageSend;
import co.airy.core.rasa_connector.models.MessageSendResponse;
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
public class RasaConnectorService {
    private final RasaClient rasaClient;
    private static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger log = AiryLoggerFactory.getLogger(RasaConnectorService.class);
    private final MessageHandler messageHandler;

    RasaConnectorService(MessageHandler messageHandler,
                         RasaClient rasaClient) {
        this.rasaClient = rasaClient;
        this.messageHandler = messageHandler;
    }

    public List<KeyValue<String, SpecificRecordBase>> send(Message userMessage) {
        final List<KeyValue<String, SpecificRecordBase>> result = new ArrayList<>();
        try {
            List<MessageSendResponse> rasaResponseList = this.rasaClient.sendMessage(MessageSend.builder()
                    .message(getTextFromContent(userMessage.getContent()))
                    .sender(userMessage.getId())
                    .build());
            for (MessageSendResponse rasaResponse : rasaResponseList) {
                try {
                    Message message = messageHandler.getMessage(userMessage, rasaResponse);
                    result.add(KeyValue.pair(message.getId(), message));
                } catch (Exception e) {
                    log.info(String.format("could not handle response for data type for message id %s %s. Please inspect the", rasaResponse.toString(), e));
                }
            }
        } catch (Exception e) {
            log.error(String.format("could not call the Rasa webhook for message id %s %s", userMessage.getId(), e));
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
