// Store - Class that gives you access to Kafka
package co.airy.core.rasa_connector;

import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "rasa-connector";
    private final KafkaStreamsWrapper streams;

    Stores(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event){

    }

    @Override
    public void destroy(){

    }
}
