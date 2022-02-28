package co.airy.core.api.communication;

import co.airy.avro.communication.*;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.model.conversation.Conversation;
import co.airy.model.message.dto.MessageContainer;
import co.airy.model.metadata.MetadataKeys;
import co.airy.spring.auth.PrincipalAccess;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.boot.actuate.health.Health;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

/**
 * ThreadStartLogic
 * <br>
 * <code>co.airy.core.api.communication.ThreadStartLogic</code>
 * <br>
 *
 * @author Abhinav Jain
 * @since 25 February 2022
 */
@Component
public class ThreadStartLogic {

    private final ObjectMapper objectMapper;
    private final PrincipalAccess principalAccess;
    private final KafkaProducer<String, Message> producer;
    private static List<Map<Authentication, SendMessageRequestPayload>> pendingMessageList = new LinkedList<Map<Authentication, SendMessageRequestPayload>>();
    private volatile Authentication authentication;
    public CommonResource commonResource;
    private final Stores stores;


    ThreadStartLogic(Stores stores, ObjectMapper objectMapper, PrincipalAccess principalAccess, KafkaProducer<String, Message> producer, CommonResource commonResource) {
        this.stores = stores;
        this.objectMapper = objectMapper;
        this.principalAccess = principalAccess;
        this.producer = producer;
        this.commonResource = commonResource;
    }

    @PostConstruct
    @Async("threadPoolTaskExecutor")
    public void init() throws JsonProcessingException, InterruptedException, ExecutionException {
        System.out.println("calling init method");
        Conversation conversation;
        Map<Authentication, SendMessageRequestPayload> pendingMessageMap = new HashMap<Authentication, SendMessageRequestPayload>();


        while (true ) {
            if ( commonResource.getMessageQueue().size()>0 ){

                ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();

                Map.Entry<Authentication, SendMessageRequestPayload> messageMap = commonResource.getMessageQueue().poll().entrySet().iterator().next();
                SendMessageRequestPayload payload = messageMap.getValue();
                conversation = conversationsStore.get(messageMap.getValue().getConversationId().toString());

                if (conversation != null) {
                    processMessage(messageMap, authentication);
                } else {
//This is not complete need to find a logic to share a linklist
                    pendingMessageMap.put(messageMap.getKey(), messageMap.getValue());
                    pendingMessageList.add(pendingMessageMap);

                    for (Map<Authentication, SendMessageRequestPayload> pendingMessage : pendingMessageList) {
                        final long sentAt = payload.getTimestamp().toEpochMilli();

                        long lostMilli = Instant.now().toEpochMilli() - sentAt;

                        if (lostMilli > 30000) {
                            addSendMessageErrorMetadata(payload.getConversationId().toString(), payload.getConversationId().toString());
                            pendingMessageList.remove(pendingMessage);
                        } else {
                            conversation = conversationsStore.get(messageMap.getValue().getConversationId().toString());

                            if(conversation!= null){
                                processMessage(pendingMessage.entrySet().iterator().next(), authentication);

                            }

                        }
                    }
                }
            }
            Thread.sleep(5);
        }
    }

    private void addSendMessageErrorMetadata(String messageId, String conversationId) throws ExecutionException, InterruptedException {
        final MessageContainer container = stores.getMessageContainer(messageId);
        final Metadata metadata = newMessageMetadata(messageId, MetadataKeys.MessageKeys.ERROR, "Conversation with Id: " + conversationId + "could not be found in time.");
        container.getMetadataMap().put(metadata.getKey(), metadata);
        stores.storeMetadata(metadata);
    }

    private void processMessage(Map.Entry<Authentication, SendMessageRequestPayload> messageMap, Authentication authentication) throws
            JsonProcessingException {

        System.out.println("");
        Channel channel;
        String conversationId;
        SendMessageRequestPayload payload = messageMap.getValue();
        Authentication authentication1 = messageMap.getKey();

        final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();
        final Conversation conversation = conversationsStore.get(payload.getConversationId().toString());
        conversationId = conversation.getId();
        channel = conversation.getChannel();

        final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();

        final String userId = principalAccess.getUserId(authentication1);
        final Message message = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(channel.getId())
                .setSourceRecipientId(payload.getSourceRecipientId())
                .setContent(objectMapper.writeValueAsString(payload.getMessage()))
                .setConversationId(conversation.getId())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(channel.getSource())
                .setSenderId(userId)
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();

        producer.send(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message));
    }
}
