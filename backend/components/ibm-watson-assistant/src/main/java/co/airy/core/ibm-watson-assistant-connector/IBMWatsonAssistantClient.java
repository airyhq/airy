package co.airy.core.ibm_watson_assistant_connector;

import co.airy.core.ibm_watson_assistant.models.MessageSend;
import co.airy.core.ibm_watson_assistant.models.MessageSendResponse;

import feign.Headers;
import feign.RequestLine;

import java.util.List;

public interface IBMWatsonAssistantClient {
    @RequestLine("POST {URL}")
    @Headers("Content-Type: application/json, Authorization {APIKey}")
    MessageSendResponse sendMessage(MessageSend content);
}