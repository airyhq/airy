package co.airy.core.cognigy;

import co.airy.avro.communication.Message;
import co.airy.avro.communication.Metadata;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.application.ApplicationCommunicationMetadata;
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
    private static final String appId = "cognigy-connector";
    private final KafkaStreamsWrapper streams;
    private  CognigyConnectorService  cognigyConnectorService;

    Stores(KafkaStreamsWrapper streams,  CognigyConnectorService  cognigyConnectorService) {
        this.streams = streams;
        this.cognigyConnectorService =  cognigyConnectorService;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event){

        final StreamsBuilder builder = new StreamsBuilder();

        final String applicationCommunicationMetadata = new ApplicationCommunicationMetadata().name();
        final String applicationCommunicationMessages = new ApplicationCommunicationMessages().name();

        builder.<String, Message>stream(
                new ApplicationCommunicationMessages().name(),
                Consumed.with(Topology.AutoOffsetReset.LATEST)
        ).filter((messageId, message) -> message != null && isNewMessage(message) && message.getIsFromContact())
                .flatMap((messageId, message) ->  cognigyConnectorService.send(message))
                .to((recordId, record, context) -> {
                    if (record instanceof Metadata) {
                        return applicationCommunicationMetadata;
                    }
                    if (record instanceof Message) {
                        return applicationCommunicationMessages;
                    }

                    throw new IllegalStateException("Unknown type for record " + record);
                });

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
