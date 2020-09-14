package co.airy.spring.kafka.healthcheck;

import co.airy.avro.ops.HealthCheck;
import co.airy.kafka.schema.ops.OpsApplicationHealth;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ProducerHealthCheck {

    @Autowired
    private KafkaProducer<String, HealthCheck> producer;

    private final OpsApplicationHealth opsApplicationHealth = new OpsApplicationHealth();

    private void sendHealthCheck(String app) throws Exception {
        producer.send(
            new ProducerRecord<>(opsApplicationHealth.name(), null,
                HealthCheck.newBuilder()
                    .setApp(app)
                    .setTime(Instant.now().toEpochMilli())
                    .build()
            )
        ).get();
    }

    private final String SERVICE_NAME_ENV = "DD_SERVICE_NAME";

    public void sendHealthCheck() throws Exception {
        final String serviceName = System.getenv(SERVICE_NAME_ENV);
        if (serviceName == null) {
            throw new IllegalStateException(String.format("Env variable %s not set", SERVICE_NAME_ENV));
        }

        sendHealthCheck(serviceName);
    }
}
