package co.airy.core.sources.google;

import co.airy.kafka.schema.source.SourceGoogleEvents;
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

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Base64;
import java.util.Properties;
import java.util.UUID;

@RestController
public class WebhookController implements DisposableBean {
    private final String sourceGoogleEvents = new SourceGoogleEvents().name();
    private final String partnerKey;
    private static final String HMAC_SHA512 = "HmacSHA512";

    private final Producer<String, String> producer;

    WebhookController(@Value("${kafka.brokers}") String brokers,
                      @Value("${google.partner-key}") String partnerKey) {
        this.partnerKey = partnerKey;
        final Properties props = new Properties();

        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);

        producer = new KafkaProducer<>(props);
    }

    @Override
    public void destroy() {
        if (producer != null) {
            producer.close(Duration.ofSeconds(10));
        }
    }

    @PostMapping("/google")
    ResponseEntity<?> accept(@RequestBody String event, @RequestHeader("X-Goog-Signature") String signature) {
        if (!validRequest(event, signature)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String requestId = UUID.randomUUID().toString();
        try {
            ProducerRecord<String, String> record = new ProducerRecord<>(sourceGoogleEvents, requestId, event);
            producer.send(record).get();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private boolean validRequest(String payload, String signature) {
        try {
            final SecretKeySpec secretKeySpec = new SecretKeySpec(partnerKey.getBytes(), HMAC_SHA512);
            Mac mac = Mac.getInstance(HMAC_SHA512);
            mac.init(secretKeySpec);

            byte[] macData = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            final String result = Base64.getEncoder().encodeToString(macData);

            return signature.equals(result);
        } catch (InvalidKeyException | NoSuchAlgorithmException e) {
            return false;
        }
    }
}
