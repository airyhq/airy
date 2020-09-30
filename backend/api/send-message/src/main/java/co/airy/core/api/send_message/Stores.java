package co.airy.core.api.send_message;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.Conversation;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationConversations;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;

@Component
@RestController
public class Stores implements ApplicationListener<ApplicationStartedEvent>, DisposableBean {
    private static final String appId = "api.SendMessage";

    @Autowired
    private KafkaStreamsWrapper streams;

    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

    private void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        final KTable<String, Channel> channelKTable = builder.table(new ApplicationCommunicationChannels().name(), Consumed.as("channelsTable"), Materialized.as("channelsTableStore"));
        final KTable<String, Conversation> conversationKTable = builder.table(new ApplicationCommunicationConversations().name(), Consumed.as("conversationsTable"), Materialized.as("conversationsTableStore"));

        streams.start(builder.build(), appId);
    }

    @Override
    public void destroy() throws Exception {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        startStream();
    }
}
