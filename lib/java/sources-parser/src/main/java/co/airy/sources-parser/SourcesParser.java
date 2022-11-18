package co.airy.sources_parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.core.JsonProcessingException;


public class SourcesParser {
    private static final ObjectMapper sourceMapper = new ObjectMapper();

    public static String mapContent(String source, String text, JsonNode data) throws JsonProcessingException {
    
        final ObjectNode node = getNode();
        switch (source) {
            case "google": {
                final ObjectNode representative = getNode();
                representative.put("representativeType", "BOT");
                node.set("representative", representative);
                node.put("text", text);
                return sourceMapper.writeValueAsString(node);
            }
            case "viber": {
                node.put("text", text);
                node.put("type", text);
                return sourceMapper.writeValueAsString(node);
            }
            case "chatplugin":
            case "instagram":
            case "facebook": {
                node.put("text", text);
                if(data != null){
                node.put("message", data);
                }
                return sourceMapper.writeValueAsString(node);
            }
            case "twilio.sms":
            case "twilio.whatsapp": {
                node.put("Body", text);
                return sourceMapper.writeValueAsString(node);
            }
            case "whatsapp": {
                node.put("Body", text);
                return sourceMapper.writeValueAsString(node);
            }
    
            default: {
                return null;
            }
        }
    };


    private static ObjectNode getNode() {
        final JsonNodeFactory jsonNodeFactory = JsonNodeFactory.instance;
        return jsonNodeFactory.objectNode();
    }

}
