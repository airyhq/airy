package co.airy.core.api.communication;

import co.airy.avro.communication.Message;
import co.airy.core.api.communication.payload.SendMessageRequestPayload;
import co.airy.spring.auth.PrincipalAccess;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * CommonResource
 * <br>
 * <code>co.airy.core.api.communication.CommonResource</code>
 * <br>
 *
 * @author Abhinav Jain
 * @since 25 February 2022
 */

@Component
public class CommonResource {

    @Autowired
    public   LinkedBlockingQueue<Map<Authentication,SendMessageRequestPayload>> messageQueue;

    public LinkedBlockingQueue<Map<Authentication, SendMessageRequestPayload>> getMessageQueue() {
        return messageQueue;
    }

    public void setMessageQueue(LinkedBlockingQueue<Map<Authentication, SendMessageRequestPayload>> messageQueue) {
        this.messageQueue = messageQueue;
    }





}
