package co.airy.core.cognigy;

import co.airy.core.cognigy.models.MessageSendResponse;
import feign.Headers;
import feign.RequestLine;
import feign.Body;
import feign.Param;

import java.util.List;

public interface  CognigyClient {
    @RequestLine("POST {restEndpointURL}")
    @Headers("Content-Type: application/json")
    @Body("%7B\"userId\": \"{userId}\", \"sessionId\": \"{sessionId}\"%7D")
    List<MessageSendResponse> sendMessage(@Param("userId") String userId, @Param("sessionId") String sessionId, @Param("restEndpointURL") String restEndpointURL);

}
