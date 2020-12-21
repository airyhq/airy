package co.airy.core.sources.facebook;

import co.airy.kafka.schema.source.SourceFacebookEvents;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Properties;
import java.util.UUID;

@RestController
public class WebhookController implements DisposableBean {
    private final String sourceFacebookEvents = new SourceFacebookEvents().name();
    private final String webhookSecret;

    private final Producer<String, String> producer;

    WebhookController(@Value("${kafka.brokers}") String brokers,
                      @Value("${facebook.webhook-secret}") String webhookSecret) {
        this.webhookSecret = webhookSecret;
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
        if (!verifyToken.equals(this.webhookSecret)) {
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
    public void destroy() {
        if (producer != null) {
            producer.close(Duration.ofSeconds(10));
        }
    }
}
