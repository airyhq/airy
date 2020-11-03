package co.airy.spring.kafka.healthcheck;

import co.airy.avro.ops.HealthCheck;
import co.airy.kafka.schema.ops.OpsApplicationHealth;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ProducerHealthCheck {
    private final KafkaProducer<String, HealthCheck> producer;

    ProducerHealthCheck(KafkaProducer<String, HealthCheck> producer) {
        this.producer = producer;
    }

    private final String opsApplicationHealth = new OpsApplicationHealth().name();

    public void sendHealthCheck() throws Exception {
        final String serviceName = System.getenv("SERVICE_NAME");
        if (serviceName == null) {
            throw new IllegalStateException("SERVICE_NAME not set");
        }

        sendHealthCheck(serviceName);
    }

    private void sendHealthCheck(String app) throws Exception {
        producer.send(new ProducerRecord<>(opsApplicationHealth, null,
                HealthCheck.newBuilder()
                        .setApp(app)
                        .setTime(Instant.now().toEpochMilli())
                        .build())).get();
    }
}
