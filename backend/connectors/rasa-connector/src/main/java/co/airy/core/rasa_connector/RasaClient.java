package co.airy.core.rasa_connector;

import co.airy.core.rasa_connector.models.MessageSend;
import co.airy.core.rasa_connector.models.MessageSendResponse;
import feign.Headers;
import feign.RequestLine;

import java.util.List;


public interface RasaClient {
    @RequestLine("POST /webhooks/rest/webhook")
    @Headers("Content-Type: application/json")
    List<MessageSendResponse> sendMessage(MessageSend content);

}
