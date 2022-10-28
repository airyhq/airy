package co.airy.core.ibm_watson_assistant_connector;

import co.airy.core.ibm_watson_assistant.models.MessageSend;
import co.airy.core.ibm_watson_assistant.models.MessageSendResponse;

import feign.RequestLine;
import feign.Headers;

public interface IbmWatsonAssistantClient {
    @RequestLine("POST")
    @Headers("Content-Type: application/json")
    MessageSendResponse sendMessage(MessageSend content);
}