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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;

import static co.airy.model.metadata.MetadataRepository.newMessageMetadata;


@RestController
@DependsOn("Store")
public class SendMessageController {

   public  CommonResource commonResource ;

    SendMessageController(CommonResource commonResource , LinkedBlockingQueue<Map<Authentication,SendMessageRequestPayload>> messageQueue) {
        this.commonResource= commonResource;
    }

    @PostMapping("/messages.send")
    public ResponseEntity sendMessage(@RequestBody @Valid SendMessageRequestPayload payload, Authentication auth) throws ExecutionException, InterruptedException, JsonProcessingException {
        if (payload.getConversationId() == null && (payload.getSourceRecipientId() == null || payload.getChannelId() == null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Map<Authentication,SendMessageRequestPayload> map = new HashMap<Authentication,SendMessageRequestPayload>();
        map.put(auth,payload);
        commonResource.getMessageQueue().add(map);

        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}