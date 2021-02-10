package co.airy.core.api.websocket;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.core.KafkaConsumerWrapper;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.errors.WakeupException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, Runnable, DisposableBean {
    private static final String appId = "api.WebsocketConsumer";
    private final KafkaConsumerWrapper<String, SpecificRecordBase> consumer;
    private final WebSocketController webSocketController;
    private boolean running = false;

    Stores(KafkaConsumerWrapper<String, SpecificRecordBase> consumer,
           WebSocketController webSocketController
    ) {
        this.consumer = consumer;
        this.webSocketController = webSocketController;
    }

    @Override
    public void run() {
        consumer.subscribe(appId, List.of(
                new ApplicationCommunicationMetadata().name(),
                new ApplicationCommunicationMessages().name(),
                new ApplicationCommunicationChannels().name()
        ));

        running = true;

        try {
            while (running) {
                try {

                    ConsumerRecords<String, SpecificRecordBase> records = consumer.poll(Duration.ofMillis(100));
                    for (ConsumerRecord<String, SpecificRecordBase> record : records) {
                        final SpecificRecordBase value = record.value();
                        if (value instanceof Message) {
                            webSocketController.onMessage((Message) value);
                        } else if (value instanceof Metadata) {
                            webSocketController.onMetadata((Metadata) value);
                        } else if (value instanceof Channel)  {
                            webSocketController.onChannel((Channel) value);
                        }
                    }

                    if (!records.isEmpty()) {
                        consumer.commitAsync();
                    }
                } catch (WakeupException e) {
                    running = false;
                }
            }
        } finally {
            consumer.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        new Thread(this).start();
    }

    @Override
    public void destroy() {
        consumer.wakeup();
    }

    @Override
    public Health health() {
        return Health.status(running ? Status.UP : Status.DOWN).build();
    }

}
