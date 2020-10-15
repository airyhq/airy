package co.airy.core.webhook.publisher;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Status;
import co.airy.avro.communication.Webhook;
import co.airy.core.webhook.publisher.model.QueueMessage;
import co.airy.core.webhook.publisher.model.WebhookBody;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationWebhooks;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;

@Component
public class Publisher implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "webhook.Publisher";
    private final String WEBHOOKS_STORE = "webhook-store";
    private final String allWebhooksKey = "339ab777-92aa-43a5-b452-82e73c50fc59";

    @Autowired
    private KafkaStreamsWrapper streams;
    @Autowired
    private RedisQueue redisQueuePublisher;

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        builder.<String, Webhook>stream(new ApplicationCommunicationWebhooks().name())
                .groupBy((webhookId, webhook) -> allWebhooksKey)
                .reduce((oldValue, newValue) -> newValue, Materialized.as(WEBHOOKS_STORE));

        builder.<String, Message>stream(new ApplicationCommunicationMessages().name())
                // Only send new messages
                .filter(((messageId, message) -> message.getUpdatedAt() == null))
                .peek((messageId, message) -> {

                    final ReadOnlyKeyValueStore<String, Webhook> webhookStore = streams.acquireLocalStore(WEBHOOKS_STORE);
                    final Webhook webhook = webhookStore.get(allWebhooksKey);

                    if (webhook != null && webhook.getStatus().equals(Status.Subscribed)) {
                        redisQueuePublisher.publishMessage(webhook.getId(),
                                QueueMessage.builder()
                                        .endpoint(webhook.getEndpoint())
                                        .headers(webhook.getHeaders())
                                        .body(WebhookBody.fromMessage(message))
                                        .build());
                    }
                });

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        startStream();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
