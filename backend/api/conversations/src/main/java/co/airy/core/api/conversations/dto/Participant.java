package co.airy.core.api.conversations.dto;

import co.airy.avro.communication.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Participant implements Serializable {
    String senderId;
    SenderType senderType;
}
