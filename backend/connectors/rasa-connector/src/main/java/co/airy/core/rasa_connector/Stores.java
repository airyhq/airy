// Store - Class that gives you access to Kafka Store(s)
package co.airy.core.rasa_connector;

import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static co.airy.model.message.MessageRepository.isNewMessage;

@Component
public class Stores implements HealthIndicator, ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "rasa-connector";
    private final KafkaStreamsWrapper streams;
    private RasaConnectorService rasaConnectorService;

    Stores(KafkaStreamsWrapper streams, RasaConnectorService rasaConnectorService) {
        this.streams = streams;
        this.rasaConnectorService = rasaConnectorService;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event){
        final StreamsBuilder builder = new StreamsBuilder();
        builder.<String, Message>stream(
                new ApplicationCommunicationMessages().name(),
                Consumed.with(Topology.AutoOffsetReset.LATEST)
        ).filter((messageId, message) -> message != null && isNewMessage(message) && message.getIsFromContact())
               .peek((messageId, message) -> rasaConnectorService.send(message));

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy(){
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        return Health.up().build();
    }

    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
