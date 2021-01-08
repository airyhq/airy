package co.airy.core.media;

import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class Resolver implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private final Logger log = AiryLoggerFactory.getLogger(Resolver.class);

    private static final String appId = "media.Resolver";
    private final KafkaStreamsWrapper streams;

    public Resolver(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        final StreamsBuilder builder = new StreamsBuilder();

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }


    // visible for testing
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
