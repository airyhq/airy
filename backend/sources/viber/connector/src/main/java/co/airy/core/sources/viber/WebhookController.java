package co.airy.core.sources.viber;

import co.airy.core.sources.viber.BotConfiguration.WelcomeMessage;
import co.airy.kafka.schema.source.SourceViberEvents;
import com.viber.bot.Request;
import com.viber.bot.ViberSignatureValidator;
import com.viber.bot.event.Event;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;

@RestController
public class WebhookController implements DisposableBean {
    private final String sourceViberEvents = new SourceViberEvents().name();
    private final ViberSignatureValidator signatureValidator;
    private final Optional<WelcomeMessage> welcomeMessage;

    private final Producer<String, String> producer;

    public WebhookController(@Value("${kafka.brokers}") String brokers, ViberSignatureValidator signatureValidator, Optional<WelcomeMessage> welcomeMessage) {
        this.signatureValidator = signatureValidator;
        this.welcomeMessage = welcomeMessage;

        final Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producer = new KafkaProducer<>(props);
    }


    @PostMapping(value = "/viber", produces = "application/json")
    public ResponseEntity<?> accept(@RequestBody String json,
                                       @RequestHeader("X-Viber-Content-Signature") String serverSideSignature) {
        if (!signatureValidator.isSignatureValid(serverSideSignature, json)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        final Request request = Request.fromJsonString(json);

        try {
            ProducerRecord<String, String> record = new ProducerRecord<>(sourceViberEvents, UUID.randomUUID().toString(), json);
            producer.send(record).get();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }

        if (request.getEvent().getEvent().equals(Event.CONVERSATION_STARTED)) {
            return welcomeMessage.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.OK));
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    public void destroy() {
        if (producer != null) {
            producer.close(Duration.ofSeconds(10));
        }
    }

}

