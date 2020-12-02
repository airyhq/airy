package co.airy.core.twilio;

import co.airy.kafka.schema.source.SourceTwilioEvents;
import co.airy.spring.kafka.healthcheck.ProducerHealthCheck;
import com.twilio.security.RequestValidator;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import static java.util.stream.Collectors.toMap;

@RestController
public class TwilioWebhook implements HealthIndicator, DisposableBean {

    private final String sourceTwilioEvents = new SourceTwilioEvents().name();

    private final Producer<String, String> producer;
    private final String authToken;
    private final ProducerHealthCheck producerHealthCheck;

    public TwilioWebhook(ProducerHealthCheck producerHealthCheck,
                         @Value("${twilio.token}") String authToken,
                         @Value("${kafka.brokers}") String brokers) {
        this.producerHealthCheck = producerHealthCheck;
        this.authToken = authToken;

        final Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, brokers);
        props.put(ProducerConfig.RETRIES_CONFIG, String.valueOf(Integer.MAX_VALUE));
        props.put(ProducerConfig.ACKS_CONFIG, "1");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producer = new KafkaProducer<>(props);
    }


    public Health health() {
        try {
            producerHealthCheck.sendHealthCheck();
            return Health.up().build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }

    @PostMapping(
            path = "/twilio",
            consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    ResponseEntity<Void> accept(
            HttpServletRequest request
    ) throws Exception {

        final String content = getRequestBody(request);

        final Map<String, String> params = parseUrlEncoded(content);
        final String requestUrl = getFullRequestUrl(request);

        if (!isRequestAuthenticated(requestUrl, params, request.getHeader("X-Twilio-Signature"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        final String requestId = UUID.randomUUID().toString();

        try {
            ProducerRecord<String, String> record = new ProducerRecord<>(sourceTwilioEvents, requestId, content);
            producer.send(record).get();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private String getRequestBody(final HttpServletRequest request) throws IOException {
        final StringBuilder builder = new StringBuilder();
        final BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            builder.append(line);
        }
        return builder.toString();
    }


    static Map<String, String> parseUrlEncoded(String payload) {
        List<String> kvPairs = Arrays.asList(payload.split("\\&"));

        return kvPairs.stream()
                .map((kvPair) -> {
                    String[] fields = kvPair.split("=");
                    String name = URLDecoder.decode(fields[0], StandardCharsets.UTF_8);

                    // For the validation we need empty headers to be present
                    String value = "";
                    if (fields.length > 1) {
                        value = URLDecoder.decode(fields[1], StandardCharsets.UTF_8);
                    }

                    return List.of(name, value);
                })
                .collect(toMap(
                        (tuple) -> tuple.get(0),
                        (tuple) -> tuple.get(1)
                ));
    }

    private String getFullRequestUrl(HttpServletRequest request) {
        return request.getRequestURL().toString() + (request.getQueryString() == null ? "" : "?" + request.getQueryString());
    }

    private boolean isRequestAuthenticated(String requestUrl, Map<String, String> params, String headerSignature) {
        final RequestValidator validator = new RequestValidator(authToken);
        return validator.validate(requestUrl, params, headerSignature);
    }

    @Override
    public void destroy() {
        if (producer != null) {
            producer.close(Duration.ofSeconds(10));
        }
    }
}

