package co.airy.core.sources.google;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.spring.web.payload.EmptyResponsePayload;
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

import static co.airy.model.channel.ChannelPayload.fromChannel;

@RestController
public class ChannelsController {
    private static final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

    private final Stores stores;
    private final KafkaProducer<String, Channel> producer;

    public ChannelsController(Stores stores, KafkaProducer<String, Channel> producer) {
        this.stores = stores;
        this.producer = producer;
    }

    @PostMapping("/google.connect")
    ResponseEntity<?> connect(@RequestBody @Valid ConnectChannelRequestPayload requestPayload) {
        final String gbmId = requestPayload.getGbmId();
        final String sourceIdentifier = "google";

        final String channelId = UUIDv5.fromNamespaceAndName(sourceIdentifier, gbmId).toString();

        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSource(sourceIdentifier)
                .setSourceChannelId(gbmId)
                .setName(requestPayload.getName())
                .setImageUrl(requestPayload.getImageUrl())
                .build();

        try {
            producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(fromChannel(channel));
    }

    @PostMapping("/google.disconnect")
    ResponseEntity<?> disconnect(@RequestBody @Valid DisconnectChannelRequestPayload requestPayload) {
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
    private String gbmId;

    @NotNull
    private String name;

    private String imageUrl;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class DisconnectChannelRequestPayload {
    @NotNull
    private UUID channelId;
}
