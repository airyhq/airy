package io.confluent.kafka.serializers;

import static io.confluent.kafka.serializers.AbstractKafkaAvroSerDe.MAGIC_BYTE;

/**
 * This class serves the purpose of allowing access to the KafkaAvroSerDe MAGIC_BYTE field
 */
public class AiryKafkaAvroSerDe {

    public static final byte KAFKA_MAGIC_BYTE = MAGIC_BYTE;

}
