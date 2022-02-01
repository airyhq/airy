package co.airy.spring.web.events;

import co.airy.avro.ops.HttpLog;
import co.airy.kafka.schema.ops.OpsApplicationLogs;
import co.airy.spring.auth.session.UserProfile;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@ConditionalOnExpression("${logs.enabled:true}")
public class KafkaListener implements ApplicationListener<HttpEvent> {
    private final KafkaProducer<String, HttpLog> producer;
    private final OpsApplicationLogs opsApplicationLogs = new OpsApplicationLogs();

    public KafkaListener(KafkaProducer<String, HttpLog> producer) {
        this.producer = producer;
    }

    @Override
    public void onApplicationEvent(HttpEvent event) {
        try {
            final UserProfile profile = event.getUserProfile();
            final HttpLog log = HttpLog.newBuilder()
                    .setBody(event.getBody())
                    .setHeaders(event.getHeaders())
                    .setUri(event.getUrl())
                    .setUserId(Optional.ofNullable(profile).map(UserProfile::getId).orElse(null))
                    .setUserName(Optional.ofNullable(profile).map(UserProfile::getName).orElse(null))
                    .setUserAvatar(Optional.ofNullable(profile).map(UserProfile::getAvatarUrl).orElse(null))
                    .build();
            producer.send(new ProducerRecord<>(opsApplicationLogs.name(), UUID.randomUUID().toString(), log));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
