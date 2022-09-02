package co.airy.core.sources.twilio.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class Api {
    private final String authToken;
    private final String accountSid;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Api(@Value("${twilio.auth-token}") String authToken, @Value("${twilio.account-sid}") String accountSid) {
        this.authToken = authToken;
        this.accountSid = accountSid;
    }

    public void sendMessage(String from, String to, String body) throws Exception {
        Twilio.init(accountSid, authToken);

        final JsonNode jsonNode = objectMapper.readTree(body);
        MessageCreator creator;
        if (jsonNode.has("Body")) {
            creator = Message.creator(new PhoneNumber(to), new PhoneNumber(from), jsonNode.get("Body").textValue());
        } else if (jsonNode.has("MediaUrl")) {
            final JsonNode mediaNode = jsonNode.get("MediaUrl");
            creator = Message.creator(new PhoneNumber(to), new PhoneNumber(from), getMedia(mediaNode));
        } else {
            throw new Exception("Malformed message. Requires either \"Body\" or \"MediaUrl\" property");
        }
        creator.create();
    }

    private List<URI> getMedia(JsonNode mediaNode) throws Exception {
        final ArrayList<String> mediaUrls = new ArrayList<>();
        if (mediaNode.isArray()) {
            for (JsonNode node : mediaNode) {
                mediaUrls.add(node.textValue());
            }
        } else {
            mediaUrls.add(mediaNode.textValue());
        }

        try {
            return mediaUrls.stream()
                    .map(URI::create).collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new Exception("Provided MediaUrl not a url");
        }
    }
}
