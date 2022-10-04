package co.airy.core.cognigy_connector;

import co.airy.core.cognigy.models.MessageSend;
import co.airy.core.cognigy.models.MessageSendResponse;

import feign.Headers;
import feign.RequestLine;
import feign.Body;
import feign.Param;

import java.util.List;

public interface  CognigyClient {
    @RequestLine("POST {restEndpointURL}")
    @Headers("Content-Type: application/json")
    MessageSendResponse sendMessage(MessageSend content);
}