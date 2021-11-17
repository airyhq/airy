package co.airy.core.contacts;

import org.apache.kafka.streams.KafkaStreams;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class Stores implements ApplicationListener<ApplicationReadyEvent>, DisposableBean {
    private final String applicationId = "contacts.Stores";
    private final KafkaStreams streams;

    public Stores(KafkaStreams streams) {
        this.streams = streams;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {

    }

    @Override
    public void destroy() throws Exception {

    }
}
