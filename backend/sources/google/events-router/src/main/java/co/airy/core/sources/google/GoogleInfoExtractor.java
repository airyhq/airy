package co.airy.core.sources.google;

import co.airy.log.AiryLoggerFactory;
import org.slf4j.Logger;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GoogleInfoExtractor {
    private static final Logger log = AiryLoggerFactory.getLogger(GoogleInfoExtractor.class);

    private static final Pattern agentPattern = Pattern.compile("brands/(.*?)/agents/(.*)");

    static GoogleEventInfo extract(WebhookEvent event) {
        try {
            Matcher agentBrandMatcher = agentPattern.matcher(event.getAgent());
            agentBrandMatcher.find();
            final String agentId = agentBrandMatcher.group(2);

            return GoogleEventInfo.builder()
                    .agentId(agentId)
                    .conversationId(event.getConversationId())
                    .build();
        } catch (Throwable e) {
            log.info("Event {} is not parseable", event);
            throw new IllegalArgumentException("Could not extract event", e);
        }
    }

}
