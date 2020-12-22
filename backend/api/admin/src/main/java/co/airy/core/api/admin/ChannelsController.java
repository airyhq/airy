package co.airy.core.api.admin;

import co.airy.avro.communication.Channel;
import co.airy.avro.communication.ChannelConnectionState;
import co.airy.core.api.admin.payload.ChannelsResponsePayload;
import co.airy.kafka.schema.application.ApplicationCommunicationChannels;
import co.airy.model.channel.ChannelPayload;
import co.airy.payload.response.EmptyResponsePayload;
import co.airy.uuid.UUIDv5;
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
import java.util.List;
import java.util.UUID;

import static co.airy.model.channel.ChannelPayload.fromChannel;
import static java.util.stream.Collectors.toList;

@RestController
public class ChannelsController {
    private final Stores stores;
    private final KafkaProducer<String, Channel> producer;
    private final String applicationCommunicationChannels = new ApplicationCommunicationChannels().name();

    public ChannelsController(Stores stores, KafkaProducer<String, Channel> producer) {
        this.stores = stores;
        this.producer = producer;
    }

    @PostMapping("/channels.list")
    ResponseEntity<ChannelsResponsePayload> listChannels() {
        final List<Channel> channels = stores.getChannels();

        return ResponseEntity.ok(new ChannelsResponsePayload(channels.stream()
                .map(ChannelPayload::fromChannel)
                .collect(toList())));
    }

    @PostMapping("/chatplugin.connect")
    ResponseEntity<?> connect(@RequestBody @Valid ConnectChannelRequestPayload requestPayload) {
        final String sourceChannelId = requestPayload.getName();
        final String sourceIdentifier = "chat_plugin";

        final String channelId = UUIDv5.fromNamespaceAndName(sourceIdentifier, sourceChannelId).toString();

        final Channel channel = Channel.newBuilder()
                .setId(channelId)
                .setConnectionState(ChannelConnectionState.CONNECTED)
                .setSource(sourceIdentifier)
                .setSourceChannelId(sourceChannelId)
                .setName(requestPayload.getName())
                .build();

        try {
            producer.send(new ProducerRecord<>(applicationCommunicationChannels, channel.getId(), channel)).get();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        return ResponseEntity.ok(fromChannel(channel));
    }

    @PostMapping("/chatplugin.disconnect")
    ResponseEntity<?> disconnect(@RequestBody @Valid ChannelDisconnectRequestPayload requestPayload) {
        final String channelId = requestPayload.getChannelId().toString();

        final Channel channel = stores.getConnectedChannelsStore().get(channelId);

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
class ConnectChannelRequestPayload {
    @NotNull
    private String name;
}

@Data
@NoArgsConstructor
class ChannelDisconnectRequestPayload {
    @NotNull
    private UUID channelId;
}
