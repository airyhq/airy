package co.airy.core.sources.facebook;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.model.metadata.MetadataKeys;
import co.airy.core.sources.facebook.dto.SendMessageRequest;
import co.airy.core.sources.facebook.dto.Conversation;
import co.airy.core.sources.facebook.api.model.SendMessagePayload;
import co.airy.core.sources.facebook.api.model.UserProfile;
import co.airy.core.sources.facebook.api.Api;
import co.airy.core.sources.facebook.api.ApiException;
import co.airy.core.sources.facebook.api.Mapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.spring.auth.IgnoreAuthPattern;
import org.apache.kafka.streams.KeyValue;
import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static co.airy.model.message.MessageRepository.updateDeliveryState;
import static co.airy.model.metadata.MetadataKeys.Source.ContactFetchState.failed;
import static co.airy.model.metadata.MetadataKeys.Source.ContactFetchState.ok;
import static co.airy.model.metadata.MetadataRepository.getId;
import static co.airy.model.metadata.MetadataRepository.newConversationMetadata;

@Component
public class Connector {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);

    private final Api api;
    private final Mapper mapper;

    Connector(Api api, Mapper mapper) {
        this.api = api;
        this.mapper = mapper;
    }

    public Message sendMessage(SendMessageRequest sendMessageRequest) {
        final Message message = sendMessageRequest.getMessage();
        final Conversation conversation = sendMessageRequest.getConversation();

        try {
            final String pageToken = conversation.getChannel().getToken();
            final SendMessagePayload fbSendMessagePayload = mapper.fromSendMessageRequest(sendMessageRequest);

            api.sendMessage(pageToken, fbSendMessagePayload);

            updateDeliveryState(message, DeliveryState.DELIVERED);
            return message;
        } catch (ApiException e) {
            log.error(String.format("Failed to send a message to Facebook \n SendMessageRequest: %s \n Error Message: %s \n", sendMessageRequest, e.getMessage()), e);
        } catch (Exception e) {
            log.error(String.format("Failed to send a message to Facebook \n SendMessageRequest: %s", sendMessageRequest), e);
        }

        updateDeliveryState(message, DeliveryState.FAILED);
        return message;
    }

    public boolean needsMetadataFetched(Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();
        final String fetchState = metadata.get(MetadataKeys.Source.Contact.FETCH_STATE);

        return !ok.toString().equals(fetchState) && !failed.toString().equals(fetchState);
    }

    public List<KeyValue<String, Metadata>> fetchMetadata(String conversationId, Conversation conversation) {
        final UserProfile profile = getProfile(conversation);

        final List<KeyValue<String, Metadata>> recordList = new ArrayList<>();

        if (profile.getFirstName() != null) {
            final Metadata firstName = newConversationMetadata(conversationId, MetadataKeys.Source.Contact.FIRST_NAME, profile.getFirstName());
            recordList.add(KeyValue.pair(getId(firstName).toString(), firstName));
        }

        if (profile.getLastName() != null) {
            final Metadata lastName = newConversationMetadata(conversationId, MetadataKeys.Source.Contact.LAST_NAME, profile.getLastName());
            recordList.add(KeyValue.pair(getId(lastName).toString(), lastName));
        }

        if (profile.getProfilePic() != null) {
            final Metadata avatarUrl = newConversationMetadata(conversationId, MetadataKeys.Source.Contact.AVATAR_URL, profile.getProfilePic());
            recordList.add(KeyValue.pair(getId(avatarUrl).toString(), avatarUrl));
        }

        final String newFetchState = recordList.size() > 0 ? ok.toString() : failed.toString();
        final String oldFetchState = conversation.getMetadata().get(MetadataKeys.Source.Contact.FETCH_STATE);

        // Only update fetch state if there has been a change
        if (!newFetchState.equals(oldFetchState)) {
            final Metadata fetchState = newConversationMetadata(conversationId, MetadataKeys.Source.Contact.FETCH_STATE, newFetchState);
            recordList.add(KeyValue.pair(getId(fetchState).toString(), fetchState));
        }

        return recordList;
    }

    public UserProfile getProfile(Conversation conversation) {
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
}
