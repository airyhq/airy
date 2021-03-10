package co.airy.core.sources.google;

import co.airy.avro.communication.Metadata;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

public class InfoExtractor {
    private static final Logger log = AiryLoggerFactory.getLogger(InfoExtractor.class);

    private static final Pattern agentPattern = Pattern.compile("brands/(.*?)/agents/(.*)");

    static EventInfo extract(WebhookEvent event) {
        try {
            Matcher agentBrandMatcher = agentPattern.matcher(event.getAgent());
            agentBrandMatcher.find();
            final String agentId = agentBrandMatcher.group(2);

            return EventInfo.builder()
                    .agentId(agentId)
                    .sourceConversationId(event.getConversationId())
                    .build();
        } catch (Throwable e) {
            log.info("Event {} is not parseable", event);
            throw new IllegalArgumentException("Could not extract event", e);
        }
    }

    static List<Metadata> getMetadataFromContext(String conversationId, WebhookEvent webhookEvent) {
        final JsonNode context = webhookEvent.getContext();

        List<Metadata> metadata = new ArrayList<>();

        final JsonNode userInfo = context.get("userInfo");
        if (userInfo != null && userInfo.has("displayName")) {
            final String displayName = userInfo.get("displayName").textValue();
            metadata.add(newConversationMetadata(conversationId, MetadataKeys.ConversationKeys.Contact.DISPLAY_NAME, displayName));
        }

        return metadata;
    }
}
