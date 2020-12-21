package co.airy.core.sources.twilio;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.payload.response.ChannelPayload;
import co.airy.payload.response.EmptyResponsePayload;
import co.airy.uuid.UUIDv5;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.UUID;


@RestController
public class ChannelsController {
    private static final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

    private final Stores stores;
    private final KafkaProducer<String, Channel> producer;

    public ChannelsController(Stores stores, KafkaProducer<String, Channel> producer) {
        this.stores = stores;
        this.producer = producer;
    }

    @PostMapping("/twilio.sms.connect")
    ResponseEntity<?> connectSms(@RequestBody @Valid ConnectChannelRequestPayload requestPayload) {
        return connectChannel(requestPayload, "twilio.sms");
    }

    @PostMapping("/twilio.whatsapp.connect")
    ResponseEntity<?> connectWhatsapp(@RequestBody @Valid ConnectChannelRequestPayload requestPayload) {
        return connectChannel(requestPayload, "twilio.whatsapp");
    }

    private ResponseEntity<?> connectChannel(ConnectChannelRequestPayload requestPayload, String sourceIdentifier) {
        final String channelId = UUIDv5.fromNamespaceAndName(sourceIdentifier, requestPayload.getSourceChannelId()).toString();


        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSource(sourceIdentifier)
                .setSourceChannelId(requestPayload.getSourceChannelId())
                .setName(requestPayload.getName())
                .build();

        try {
            producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(ChannelPayload.builder()
                .name(channel.getName())
                .id(channel.getId())
                .imageUrl(channel.getImageUrl())
                .source(channel.getSource())
                .sourceChannelId(channel.getSourceChannelId())
                .build());
    }

    @PostMapping("/twilio.sms.disconnect")
    ResponseEntity<?> disconnectSms(@RequestBody @Valid DisconnectChannelRequestPayload requestPayload) {
        return disconnect(requestPayload);
    }

    @PostMapping("/twilio.whatsapp.disconnect")
    ResponseEntity<?> disconnectWhatsapp(@RequestBody @Valid DisconnectChannelRequestPayload requestPayload) {
        return disconnect(requestPayload);
    }

    private ResponseEntity<?> disconnect(@RequestBody @Valid DisconnectChannelRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();

        final Channel channel = stores.getChannelsStore().get(channelId);

        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

        if (channel.getConnectionState().equals(ChannelConnectionState.DISCONNECTED)) {
            return ResponseEntity.accepted().build();
        }

        channel.setConnectionState(ChannelConnectionState.DISCONNECTED);
        channel.setToken(null);

        try {
            producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(new EmptyResponsePayload());
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ConnectChannelRequestPayload {
    @NotNull
    private String sourceChannelId;

    @NotNull
    private String name;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DisconnectChannelRequestPayload {
    @NotNull
    private UUID channelId;
}
