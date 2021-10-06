package co.airy.core.sources.viber;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.viber.dto.SendMessageRequest;
import co.airy.core.sources.viber.dto.SendMessageResponse;
import co.airy.core.sources.viber.services.Api;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.filters.RequestLoggingIgnorePatterns;
import co.airy.tracking.RouteTracking;
import com.viber.bot.api.ViberBot;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import static co.airy.model.message.MessageRepository.updateDeliveryState;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
public class Connector {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);

    private final long messageStaleAfterSec = 300L; // 5 minutes
    private final ViberBot viberBot;
    private final Api api;

    public Connector(ViberBot viberBot, Api api) {
        this.viberBot = viberBot;
        this.api = api;
    }

    public List<KeyValue<String, SpecificRecordBase>> sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();
        final String to = sendMessageRequest.getSourceConversationId();

        if (isMessageStale(message)) {
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        try {
            final SendMessageResponse response = api.sendMessage(to, viberBot.getBotProfile(), message.getContent());

            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ID, response.getMessageToken().toString());
            updateDeliveryState(message, DeliveryState.DELIVERED);

            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to viber \n SendMessageRequest: %s", sendMessageRequest), e);
        }

        updateDeliveryState(message, DeliveryState.FAILED);
        return List.of(KeyValue.pair(message.getId(), message));
    }

    private boolean isMessageStale(Message message) {
        return ChronoUnit.SECONDS.between(Instant.ofEpochMilli(message.getSentAt()), Instant.now()) > messageStaleAfterSec;
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/viber");
    }

    @Bean
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of("/viber"));
    }

    @Bean
    private RouteTracking routeTracking(@Value("${CORE_ID}") String coreId) {
        Pattern urlPattern = Pattern.compile(".*viber\\.connect$");
        HashMap<String, String> properties = new HashMap<>(Map.of("channel", "viber"));
        return new RouteTracking(coreId, urlPattern, "channel_connected", properties);
    }
}
