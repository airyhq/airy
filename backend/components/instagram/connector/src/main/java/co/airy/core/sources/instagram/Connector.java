package co.airy.core.sources.instagram;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.core.sources.instagram.api.Api;
import co.airy.core.sources.instagram.api.ApiException;
import co.airy.core.sources.instagram.api.Mapper;
import co.airy.core.sources.instagram.api.model.SendMessagePayload;
import co.airy.core.sources.instagram.api.model.SendMessageResponse;
import co.airy.core.sources.instagram.api.model.UserProfile;
import co.airy.core.sources.instagram.dto.Conversation;
import co.airy.core.sources.instagram.dto.SendMessageRequest;
import co.airy.log.AiryLoggerFactory;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.auth.IgnoreAuthPattern;
import co.airy.spring.web.filters.RequestLoggingIgnorePatterns;
import co.airy.tracking.RouteTracking;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

import static co.airy.model.message.MessageRepository.updateDeliveryState;
import static co.airy.model.metadata.MetadataKeys.ConversationKeys;
import static co.airy.model.metadata.MetadataKeys.ConversationKeys.ContactFetchState.failed;
import static co.airy.model.metadata.MetadataKeys.ConversationKeys.ContactFetchState.ok;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;
import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@Component
public class Connector {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);

    private final long messageStaleAfterSec = 300L; // 5 minutes
    private final Api api;
    private final Mapper mapper;

    Connector(Api api, Mapper mapper) {
        this.api = api;
        this.mapper = mapper;
    }

    public List<KeyValue<String, SpecificRecordBase>> sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();
        final Conversation conversation = sendMessageRequest.getConversation();

        if (isMessageStale(message)) {
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        if (sendMessageRequest.getConversation().getSourceConversationId() == null) {
            // Cannot start conversation for Facebook
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message));
        }

        try {
            final String pageToken = conversation.getChannel().getToken();
            final SendMessagePayload payload = mapper.fromSendMessageRequest(sendMessageRequest);

            final SendMessageResponse response = api.sendMessage(pageToken, payload);
            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ID, response.getMessageId());
            updateDeliveryState(message, DeliveryState.DELIVERED);

            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        } catch (ApiException e) {
            log.error(String.format("Failed to send a \n SendMessageRequest: %s \n Api Exception: %s \n", sendMessageRequest, e.getMessage()), e);
            final ArrayList<KeyValue<String, SpecificRecordBase>> results = new ArrayList<>();
            final Metadata error = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.ERROR, e.getMessage());
            results.add(KeyValue.pair(getId(error).toString(), error));

            if (e.getErrorPayload() != null) {
                final Metadata errorPayload = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.Source.ERROR, e.getErrorPayload());
                results.add(KeyValue.pair(getId(errorPayload).toString(), errorPayload));
            }
            updateDeliveryState(message, DeliveryState.FAILED);
            results.add(KeyValue.pair(message.getId(), message));
            return results;
        } catch (Exception e) {
            log.error(String.format("Failed to send a \n SendMessageRequest: %s", sendMessageRequest), e);
            final Metadata metadata = newMessageMetadata(message.getId(), MetadataKeys.MessageKeys.ERROR, e.getMessage());
            updateDeliveryState(message, DeliveryState.FAILED);
            return List.of(KeyValue.pair(message.getId(), message), KeyValue.pair(getId(metadata).toString(), metadata));
        }
    }

    private boolean isMessageStale(Message message) {
        return ChronoUnit.SECONDS.between(Instant.ofEpochMilli(message.getSentAt()), Instant.now()) > messageStaleAfterSec;
    }

    public boolean needsMetadataFetched(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();
        final String fetchState = metadata.get(ConversationKeys.Contact.FETCH_STATE);

        return !ok.toString().equals(fetchState) && !failed.toString().equals(fetchState);
    }

    public List<KeyValue<String, Metadata>> fetchMetadata(String conversationId, Conversation conversation) {
        final UserProfile profile = Optional.ofNullable(getUserProfile(conversation)).orElse(new UserProfile());

        final List<KeyValue<String, Metadata>> recordList = new ArrayList<>();

        if (profile.getFirstName() != null || profile.getLastName() != null) {
            final String displayName = String.format("%s %s", Objects.toString(profile.getFirstName(), ""),
                    Objects.toString(profile.getLastName(), "")).trim();
            final Metadata displayNameMetadata = newConversationMetadata(conversationId, ConversationKeys.Contact.DISPLAY_NAME, displayName);
            recordList.add(KeyValue.pair(getId(displayNameMetadata).toString(), displayNameMetadata));
        }

        if (profile.getProfilePic() != null) {
            final Metadata avatarUrl = newConversationMetadata(conversationId, ConversationKeys.Contact.AVATAR_URL, profile.getProfilePic());
            recordList.add(KeyValue.pair(getId(avatarUrl).toString(), avatarUrl));
        }

        final String newFetchState = recordList.size() > 0 ? ok.toString() : failed.toString();
        final String oldFetchState = conversation.getMetadata().get(ConversationKeys.Contact.FETCH_STATE);

        // Only update fetch state if there has been a change
        if (!newFetchState.equals(oldFetchState)) {
            final Metadata fetchState = newConversationMetadata(conversationId, ConversationKeys.Contact.FETCH_STATE, newFetchState);
            recordList.add(KeyValue.pair(getId(fetchState).toString(), fetchState));
        }

        return recordList;
    }

    public UserProfile getUserProfile(Conversation conversation) {
        if (conversation.getChannel().getSource().equals("instagram")) {
            return getInstagramProfile(conversation);
        }

        return getMessengerProfile(conversation);
    }

    private UserProfile getInstagramProfile(Conversation conversation) {
        final String sourceConversationId = conversation.getSourceConversationId();
        final String token = conversation.getChannel().getToken();
        try {
            return api.getInstagramProfile(sourceConversationId, token);
        } catch (Exception profileApiException) {
            log.error("Instagram profile api failed", profileApiException);
            return new UserProfile();
        }
    }

    private UserProfile getMessengerProfile(Conversation conversation) {
        final String sourceConversationId = conversation.getSourceConversationId();
        final String token = conversation.getChannel().getToken();
        try {
            return api.getProfileFromContact(sourceConversationId, token);
        } catch (Exception profileApiException) {
            log.error("Profile api failed", profileApiException);
            try {
                return api.getProfileFromParticipants(sourceConversationId, token);
            } catch (Exception participantApiException) {
                log.error("Participant api failed", participantApiException);
                return new UserProfile();
            }
        }
    }

    @Bean
    public IgnoreAuthPattern ignoreAuthPattern() {
        return new IgnoreAuthPattern("/facebook");
    }

    @Bean
    public RequestLoggingIgnorePatterns requestLoggingIgnorePatterns() {
        return new RequestLoggingIgnorePatterns(List.of("/facebook"));
    }

    @Bean
    private RouteTracking routeTracking() {
        Pattern urlPattern = Pattern.compile(".*facebook\\.connect$");
        HashMap<String, String> properties = new HashMap<>(Map.of("channel", "facebook"));
        return new RouteTracking(urlPattern, "channel_connected", properties);
    }
}
