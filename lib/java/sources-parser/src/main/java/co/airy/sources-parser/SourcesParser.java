package co.airy.sources_parser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;


public class SourcesParser {
    private final ObjectMapper mapper = new ObjectMapper();

    public getSourceMapper(String source, JsonNode response) {
        final String text = response.getText();

        if (text == null) {
            return null;
        }
    
        final ObjectNode node = getNode();
        switch (source) {
            case "google": {
                final ObjectNode representative = getNode();
                representative.put("representativeType", "BOT");
                node.set("representative", representative);
                node.put("text", text);
                return mapper.writeValueAsString(node);
            }
            case "viber": {
                node.put("text", text);
                node.put("type", text);
                return mapper.writeValueAsString(node);
            }
            case "chatplugin":
            case "instagram":
            case "facebook": {
                node.put("text", text);
                return mapper.writeValueAsString(node);
            }
            case "twilio.sms":
            case "twilio.whatsapp": {
                node.put("Body", text);
                return mapper.writeValueAsString(node);
            }
            case "whatsapp": {
                node.put("Body", text);
                return mapper.writeValueAsString(node);
            }
    
            default: {
                return null;
            }
        }

    };
}
