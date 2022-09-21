package co.airy.core.sources.whatsapp;

import co.airy.kafka.schema.source.SourceWhatsappEvents;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Properties;
import java.util.UUID;

import static co.airy.crypto.Signature.getSha1;

@RestController
public class WebhookController implements DisposableBean {
    private final String sourceWhatsappEvents = new SourceWhatsappEvents().name();
    private final String webhookSecret;
    private final String appSecret;

    private final Producer<String, String> producer;

    WebhookController(@Value("${kafka.brokers}") String brokers,
                      @Value("${webhookSecret}") String webhookSecret,
                      @Value("${appSecret}") String appSecret) {
        this.webhookSecret = webhookSecret;
        this.appSecret = appSecret;
        final Properties props = new Properties();

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);

        producer = new KafkaProducer<>(props);
    }

    // https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
    @GetMapping("/whatsapp")
    int verify(@RequestParam(value = "hub.challenge") int challenge, @RequestParam(value = "hub.verify_token") String verifyToken) {
        if (!verifyToken.equals(this.webhookSecret)) {
            return 0;
        }

        return challenge;
    }

    @PostMapping("/whatsapp")
    ResponseEntity<Void> accept(@RequestBody String event, @RequestHeader("x-hub-signature") String signature) {
        if (!isSignatureValid(event, signature)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String requestId = UUID.randomUUID().toString();
        try {
            ProducerRecord<String, String> record = new ProducerRecord<>(sourceWhatsappEvents, requestId, event);
            producer.send(record).get();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    private boolean isSignatureValid(String payload, String signature) {
        if (signature == null) {
            return false;
        }
        final String[] splits = signature.split("=");
        if (splits.length != 2) {
            return false;
        }
        final String givenSha = splits[1];
        final String expectedSha = getSha1(payload + appSecret);
        return expectedSha.equals(givenSha);
    }

    @Override
    public void destroy() {
        if (producer != null) {
            producer.close(Duration.ofSeconds(10));
        }
    }
}
