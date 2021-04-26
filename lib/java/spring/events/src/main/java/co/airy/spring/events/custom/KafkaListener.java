package co.airy.spring.events.custom;

import co.airy.avro.ops.HttpLog;
import co.airy.kafka.schema.ops.OpsApplicationLogs;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class KafkaListener implements ApplicationListener<HttpEvent> {

    private final KafkaProducer<String, HttpLog> producer;
    private final OpsApplicationLogs opsApplicationLogs = new OpsApplicationLogs();

    public KafkaListener(KafkaProducer<String, HttpLog> producer) {
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(HttpEvent event) {
        try {
            final HttpLog log = HttpLog.newBuilder()
                    .setBody(event.getBody())
                    .setHeaders(event.getHeaders())
                    .setUri(event.getUrl())
                    .build();
            producer.send(new ProducerRecord<>(opsApplicationLogs.name(), UUID.randomUUID().toString(), log));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}