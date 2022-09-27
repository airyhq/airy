package co.airy.core.cognigy;

import co.airy.core.cognigy.models.MessageSend;
import co.airy.core.cognigy.models.MessageSendResponse;
import feign.Headers;
import feign.RequestLine;
import feign.Body;

import java.util.List;

public interface  CognigyClient {
    @RequestLine("POST {cognigy.restEndpointURL}")
    @Headers("Content-Type: application/json")
    @Body("{userId: {cognigy.userId}, sessionId: 'someUniqueId'}")
    List<MessageSendResponse> sendMessage(MessageSend content);

}
