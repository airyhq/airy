package co.airy.core.sources.facebook;

import co.airy.kafka.schema.source.SourceFacebookEvents;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Properties;
import java.util.UUID;

@RestController
public class FacebookWebhook implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {

    private String sourceFacebookEvents = new SourceFacebookEvents().name();

    @Value("${kafka.brokers}")
    private String brokers;

    private Producer<String, String> producer;

    private void setup() {
        final Properties props = new Properties();

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);

        producer = new KafkaProducer<>(props);
    }

    // https://developers.facebook.com/docs/graph-api/webhooks/getting-started
    @GetMapping("/facebook")
    int verify(@RequestParam(value = "hub.challenge") int challenge, @RequestParam(value = "hub.verify_token") String verifyToken) {
        if (!verifyToken.equals("ThisIsFineAndTheAnswerIsFortyTwo")) {
            return 0;
        }

        return challenge;
    }

    @PostMapping("/facebook")
    ResponseEntity<Void> accept(@RequestBody String event) {
        String requestId = UUID.randomUUID().toString();
        try {
            ProducerRecord<String, String> record = new ProducerRecord<>(sourceFacebookEvents, requestId, event);
            producer.send(record).get();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        setup();
    }

    @Override
    public void destroy() {
        if (producer != null) {
            producer.close(Duration.ofSeconds(10));
        }
    }
}
