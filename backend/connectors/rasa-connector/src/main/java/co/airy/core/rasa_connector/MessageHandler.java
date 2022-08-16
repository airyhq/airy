package co.airy.core.rasa_connector;

import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.core.rasa_connector.models.MessageSendResponse;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class MessageHandler {
    private final KafkaProducer<String, SpecificRecordBase> producer;
    private final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();
    private final ObjectMapper mapper = new ObjectMapper();

    MessageHandler(KafkaProducer<String, SpecificRecordBase> producer) {
        this.producer = producer;
    }
    public void storeMessage(Message message) throws ExecutionException, InterruptedException {
        producer.send(new ProducerRecord<>(applicationCommunicationMessages, message.getId(), message)).get();
    }

    public void writeReplyToKafka(Message message, MessageSendResponse response) throws Exception {
        final Message reply = Message.newBuilder()
                .setId(UUID.randomUUID().toString())
                .setChannelId(message.getChannelId())
                //TODO: handle correctly the content for all sources
                //      https://github.com/airyhq/cloud/issues/294
                // Write image URL instead of render it
                .setContent(mapper.writeValueAsString(Map.of("text", (response.getText() != null) ? response.getText() : response.getImage())))
                .setConversationId(message.getConversationId())
                .setHeaders(Map.of())
                .setDeliveryState(DeliveryState.PENDING)
                .setSource(message.getSource())
                .setSenderId("rasa")
                .setSentAt(Instant.now().toEpochMilli())
                .setIsFromContact(false)
                .build();

        storeMessage(reply);
    }

}