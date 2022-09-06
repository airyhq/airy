package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.avro.communication.DeliveryState;
import co.airy.avro.communication.Message;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.kafka.schema.application.ApplicationCommunicationMessages;
import co.airy.kafka.schema.source.SourceTwilioEvents;
import co.airy.kafka.streams.KafkaStreamsWrapper;
import co.airy.log.AiryLoggerFactory;
import co.airy.uuid.UUIDv5;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KTable;
import org.slf4j.Logger;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class EventsRouter implements HealthIndicator, DisposableBean, ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = AiryLoggerFactory.getLogger(EventsRouter.class);
    public static final String appId = "sources.twilio.EventsRouter";
    private final KafkaStreamsWrapper streams;

    public EventsRouter(KafkaStreamsWrapper streams) {
        this.streams = streams;
    }

    public void startStream() {
        final StreamsBuilder builder = new StreamsBuilder();

        // Channels table
        KTable<String, Channel> channelsTable = builder.<String, Channel>stream(new ApplicationCommunicationChannels().name())
                .groupBy((k, v) -> v.getSourceChannelId())
                .reduce((aggValue, newValue) -> newValue)
                .filter((sourceChannelId, channel) -> channel.getSource().startsWith("twilio")
                        && channel.getConnectionState().equals(ChannelConnectionState.CONNECTED));

        builder.<String, String>stream(new SourceTwilioEvents().name()).map((key, sourceEvent) -> {
            try {
                TwilioEventInfo twilioEventInfo = TwilioInfoExtractor.extract(sourceEvent);

                return KeyValue.pair(twilioEventInfo.getTo(), twilioEventInfo);
            } catch (Exception e) {
                log.warn("error in record. key={} event={} e={}", key, sourceEvent, e.toString());
                return KeyValue.pair("skip", null);
            }
        })
                .filter((k, v) -> v != null)
                .transform(TimestampExtractor.timestampExtractor())
                .join(channelsTable, (event, channel) -> event.toBuilder().channel(channel).build())
                .map((sourceChannelId, event) -> {
                    final String sourceConversationId = event.getFrom();
                    final String payload = event.getPayload();
                    final Channel channel = event.getChannel();

                    final String conversationId = UUIDv5.fromNamespaceAndName(channel.getId(), sourceConversationId).toString();
                    final String messageId = UUIDv5.fromNamespaceAndName(channel.getId(), payload).toString();

                    try {
                        return KeyValue.pair(
                                messageId,
                                Message.newBuilder()
                                        .setSenderId(sourceConversationId)
                                        .setIsFromContact(true)
                                        .setSource(channel.getSource())
                                        .setContent(payload)
                                        .setDeliveryState(DeliveryState.DELIVERED)
                                        .setId(messageId)
                                        .setChannelId(channel.getId())
                                        .setConversationId(conversationId)
                                        .setSentAt(event.getTimestamp())
                                        .build()
                        );
                    } catch (Exception e) {
                        log.warn("skip twilio record for error: " + event.toString(), e);
                        return KeyValue.pair("skip", null);
                    }
                })
                .filter((conversationId, message) -> message != null)
                .to(new ApplicationCommunicationMessages().name());

        streams.start(builder.build(), appId);
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        startStream();
    }

    @Override
    public void destroy() {
        if (streams != null) {
            streams.close();
        }
    }

    @Override
    public Health health() {
        if (streams == null || !streams.state().isRunningOrRebalancing()) {
            return Health.down().build();
        }
        return Health.up().build();
    }

    /**
     * Visible For Testing
     *
     * @return The state of the kafka stream
     */
    KafkaStreams.State getStreamState() {
        return streams.state();
    }
}
