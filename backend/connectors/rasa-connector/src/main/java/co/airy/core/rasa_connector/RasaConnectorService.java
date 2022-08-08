package co.airy.core.rasa_connector;

import co.airy.avro.communication.Message;
import co.airy.core.rasa_connector.models.MessageSend;
import co.airy.core.rasa_connector.models.MessageSendResponse;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;
import org.slf4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RasaConnectorService {
    //private final apiToken;
    private final String rasaRestUrl = "https://03fb-90-187-94-193.eu.ngrok.io"; //TODO: ask Juan how to inject from resources
    private RasaClient rasaClient;
    private static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger log = AiryLoggerFactory.getLogger(RasaConnectorService.class);

    RasaConnectorService(){
        this.rasaClient = bootstrapRasaClient(rasaRestUrl);
    }

    @Async("threadPoolTaskExecutor")
    public void send(Message message) {
        try {
            List<MessageSendResponse> messageResp = this.rasaClient.sendMessage(MessageSend.builder()
                    .message(getTextFromContent(message.getContent()))
                    .sender(message.getId())
                    .build());

            log.info("Response: {}", messageResp.get(0).getText());
        }
        catch (Exception e){
            log.error(String.format("unexpected exception for message id %s %s", message.getId(), e.toString()));
        }
    }
    // Add API token later
    private RasaClient bootstrapRasaClient(String rasaRestUrl) {
        return Feign.builder()
                .client(new OkHttpClient())
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .logger(new feign.Logger.ErrorLogger())
                .logLevel(feign.Logger.Level.FULL)
//                .requestInterceptor(requestTemplate -> {
//                    requestTemplate.header(HttpHeaders.AUTHORIZATION, String.format("Basic %s", apiToken));
//                })
                .target(RasaClient.class, rasaRestUrl);
    }

    // Helper method from Juan used in pushednotification & dialougeflow
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