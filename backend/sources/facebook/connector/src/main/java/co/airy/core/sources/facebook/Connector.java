package co.airy.core.sources.facebook;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.avro.communication.MetadataKeys;
import co.airy.avro.communication.SenderType;
import co.airy.core.sources.facebook.model.Conversation;
import co.airy.core.sources.facebook.model.SendMessagePayload;
import co.airy.core.sources.facebook.model.SendMessageRequest;
import co.airy.core.sources.facebook.model.UserProfile;
import co.airy.core.sources.facebook.services.Api;
import co.airy.core.sources.facebook.services.Mapper;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Suppressed;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static co.airy.avro.communication.MessageRepository.updateDeliveryState;
import static co.airy.avro.communication.MetadataKeys.Source.ContactFetchState.failed;
import static co.airy.avro.communication.MetadataKeys.Source.ContactFetchState.ok;
import static co.airy.avro.communication.MetadataRepository.getId;
import static co.airy.avro.communication.MetadataRepository.getSubject;
import static co.airy.avro.communication.MetadataRepository.isConversationMetadata;
import static co.airy.avro.communication.MetadataRepository.newConversationMetadata;

@Component
public class Connector implements DisposableBean, ApplicationListener<ApplicationReadyEvent> {
    private static final Logger log = AiryLoggerFactory.getLogger(Connector.class);
    private static final String appId = "sources.facebook.Connector";

    private final KafkaStreamsWrapper streams;
    private final Api api;
    private final Mapper mapper;

    Connector(KafkaStreamsWrapper streams, Api api, Mapper mapper) {
        this.streams = streams;
        this.api = api;
        this.mapper = mapper;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        final StreamsBuilder builder = new StreamsBuilder();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>table(new ApplicationCommunicationChannels().name())
                .filter((sourceChannelId, channel) -> "facebook".equalsIgnoreCase(channel.getSource())
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        // Facebook messaging stream by conversation-id
        final KStream<String, Message> messageStream = builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                .filter((messageId, message) -> "facebook".equalsIgnoreCase(message.getSource()))
                .selectKey((messageId, message) -> message.getConversationId());

        // Metadata table
        final KTable<String, Map<String, String>> metadataTable = builder.<String, Metadata>table(new ApplicationCommunicationMetadata().name())
                .filter((metadataId, metadata) -> isConversationMetadata(metadata))
                .groupBy((metadataId, metadata) -> KeyValue.pair(getSubject(metadata).getIdentifier(), metadata))
                .aggregate(HashMap::new, (conversationId, metadata, aggregate) -> {
                    aggregate.put(metadata.getKey(), metadata.getValue());
                    return aggregate;
                }, (conversationId, metadata, aggregate) -> {
                    aggregate.remove(metadata.getKey());
                    return aggregate;
                });

        // Conversation table
        final KTable<String, Conversation> conversationTable = messageStream
                .groupByKey()
                .aggregate(Conversation::new,
                        (conversationId, message, aggregate) -> {
                            if (SenderType.SOURCE_CONTACT.equals(message.getSenderType())) {
                                aggregate.setSourceConversationId(message.getSenderId());
                            }

                            aggregate.setChannelId(message.getChannelId());

                            return aggregate;
                        })
                .join(channelsTable, Conversation::getChannelId, (aggregate, channel) -> {
                    aggregate.setChannel(channel);
                    return aggregate;
                });

        // Send outbound messages
        messageStream.filter((messageId, message) -> DeliveryState.PENDING.equals(message.getDeliveryState()))
                .join(conversationTable, (message, conversation) -> new SendMessageRequest(conversation, message))
                .mapValues(this::sendMessage)
                .to(new ApplicationCommunicationMessages().name());

        // Fetch missing metadata
        conversationTable
                // To avoid any redundant fetch contact operations the suppression interval should
                // be higher than the timeout of the Facebook API
                .suppress(Suppressed.untilTimeLimit(Duration.ofMillis(streams.getSuppressIntervalInMs()), Suppressed.BufferConfig.unbounded()))
                .toStream()
                .leftJoin(metadataTable, (conversation, metadataMap) -> {
                    conversation.setMetadata(new HashMap<>(Optional.ofNullable(metadataMap).orElse(Map.of())));
                    return conversation;
                })
                .filter(this::needsMetadataFetched)
                .flatMap(this::fetchMetadata)
                .to(new ApplicationCommunicationMetadata().name());


        streams.start(builder.build(), appId);
    }

    private Message sendMessage(SendMessageRequest sendMessageRequest) {
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

    private boolean needsMetadataFetched(String conversationId, Conversation conversation) {
        final Map<String, String> metadata = conversation.getMetadata();
        final String fetchState = metadata.get(MetadataKeys.Source.Contact.FETCH_STATE);

        return !ok.toString().equals(fetchState) && !failed.toString().equals(fetchState);
    }

    private List<KeyValue<String, Metadata>> fetchMetadata(String conversationId, Conversation conversation) {
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


    private UserProfile getProfile(Conversation conversation) {
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

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
