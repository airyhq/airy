// Store - Class that gives you access to Kafka Store(s)
package co.airy.core.rasa_connector;

import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Consumed;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static co.airy.model.message.MessageRepository.isNewMessage;

@Component
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "rasa-connector";
    private final KafkaStreamsWrapper streams;

    Stores(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event){
        //Called after the instructor

        final StreamsBuilder builder = new StreamsBuilder();
        builder.<String, Message>stream(
                new ApplicationCommunicationMessages().name(),
                Consumed.with(Topology.AutoOffsetReset.LATEST)
        ).filter((messageId, message) -> message != null && isNewMessage(message) && message.getIsFromContact() == true).peek((messageId, message) -> System.out.println(messageId + message.getContent()));

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy(){
        if (streams != null) {
            streams.close();
        }
    }
}
