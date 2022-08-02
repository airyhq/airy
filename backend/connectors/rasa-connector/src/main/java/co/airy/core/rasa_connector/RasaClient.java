package co.airy.core.rasa_connector;
import co.airy.core.rasa_connector.modelParse.ParseMessage;
import feign.Headers;
import feign.RequestLine;

public interface RasaClient {
    @RequestLine("POST /model/parse")
    @Headers("Content-Type: application/json")
    void parseModel(ParseMessage content);

}
