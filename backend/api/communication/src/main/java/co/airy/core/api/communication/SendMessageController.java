package co.airy.core.api.communication;

import co.airy.avro.communication.*;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.core.api.communication.service.SendMessageExecutorService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;

@RestController
public class SendMessageController {
    private final Stores stores;
    private final ObjectMapper objectMapper;
    private final PrincipalAccess principalAccess;
    private final KafkaProducer<String, Message> producer;
    private final SendMessageExecutorService sendMessageExecutorService;
    private final LinkedBlockingQueue<SendMessageRequestPayload> messageQueue;

    private final ApplicationCommunicationMessages applicationCommunicationMessages = new ApplicationCommunicationMessages();

    SendMessageController(Stores stores, ObjectMapper objectMapper, PrincipalAccess principalAccess, KafkaProducer<String, Message> producer, SendMessageExecutorService sendMessageExecutorService) {
        this.stores = stores;
        this.objectMapper = objectMapper;
        this.principalAccess = principalAccess;
        this.producer = producer;
        this.sendMessageExecutorService = sendMessageExecutorService;
        this.messageQueue = new LinkedBlockingQueue<>();
    }

    @PostMapping("/messages.send")
    public ResponseEntity<?> sendMessage(@RequestBody @Valid SendMessageRequestPayload payload, Authentication auth) throws ExecutionException, InterruptedException, JsonProcessingException {

        if (payload.getConversationId() == null && (payload.getSourceRecipientId() == null || payload.getChannelId() == null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        messageQueue.add(payload);


System.out.println("before runnable");

        Runnable runnableTask = () -> {
            try {
                Conversation conversation;
                LinkedBlockingQueue<SendMessageRequestPayload> pendingMessages = new LinkedBlockingQueue<>();
                while (!pendingMessages.isEmpty() && !messageQueue.isEmpty()) {
                    final ReadOnlyKeyValueStore<String, Conversation> conversationsStore = stores.getConversationsStore();

                    for (SendMessageRequestPayload message : messageQueue) {
                        {
                            if (message.getConversationId() != null) {
                                conversation = conversationsStore.get(message.getConversationId().toString());
                                if (conversation == null) {
                                    pendingMessages.add(message);
                                } else {
                                    processMessage(message, conversation, conversation.getChannel(), auth);
                                }
                            }
                        }
                        sendMessageExecutorService.wait(1000);
                    }

                    while (!pendingMessages.isEmpty()) {
                        SendMessageRequestPayload pendingMessage = pendingMessages.poll();
                        if (pendingMessage.getConversationId() != null) {
                            conversation = conversationsStore.get(pendingMessage.getConversationId().toString());
                            if (conversation != null) {
                                processMessage(pendingMessage, conversation, conversation.getChannel(), auth);
                            } else {
                                final long sentAt = pendingMessage.getTimestamp().toEpochMilli();
                                long lostMilli = Instant.now().toEpochMilli() - sentAt;
                                if (lostMilli > 30000) {
                                    addSendMessageErrorMetadata(pendingMessage.getConversationId().toString(), pendingMessage.getConversationId().toString());
                                } else {
                                    //need to think
                                    pendingMessages.add(pendingMessage);
                                }
                            }
                        }
                    }
                }
            } catch (InterruptedException | ExecutionException | JsonProcessingException e) {
                e.printStackTrace();
            }
        };

        sendMessageExecutorService.sendMessageAsync(runnableTask);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body("hi");
    }

    private void addSendMessageErrorMetadata(String messageId, String conversationId) throws ExecutionException, InterruptedException {
        final MessageContainer container = stores.getMessageContainer(messageId);
        final Metadata metadata = newMessageMetadata(messageId, MetadataKeys.MessageKeys.ERROR, "Conversation with Id: " + conversationId + "could not be found in time.");
        container.getMetadataMap().put(metadata.getKey(), metadata);
        stores.storeMetadata(metadata);
    }

    private void processMessage(SendMessageRequestPayload payload, Conversation conversation, Channel channel, Authentication auth) throws JsonProcessingException, ExecutionException, InterruptedException {
        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            addSendMessageErrorMetadata(payload.getConversationId().toString(), payload.getConversationId().toString());
        }
        final String userId = principalAccess.getUserId(auth);
        final Message message = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(channel.getId())
                .setSourceRecipientId(payload.getSourceRecipientId())
                .setContent(objectMapper.writeValueAsString(payload.getMessage()))
                .setConversationId(conversation.getId())
                //  .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(channel.getSource())
                .setSenderId(userId)
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();

        producer.send(new ProducerRecord<>(applicationCommunicationMessages.name(), message.getId(), message)).get();
    }
}