package backend.lib.kafka.streams.src.main.java.co.airy.kafka.streams.processor;

import co.airy.kafka.schema.Topic;
import org.apache.avro.Schema;
import org.apache.avro.specific.SpecificRecordBase;
import org.apache.kafka.streams.processor.TopicNameExtractor;

import java.util.ArrayList;
import java.util.Map;

import static java.util.stream.Collectors.toMap;


// put in /processor dir, because this corresponds to the kafka package layout
public class TopicNameExtractorFactory {

    public static TopicNameExtractor<String, SpecificRecordBase> getExtractorByRecordType(Map<Schema, Topic> recordTypeTopicMap) {

        final Map<String, String> table = recordTypeTopicMap
            .entrySet()
            .stream()
            .collect(
                toMap(
                    (Map.Entry<Schema, Topic> it) -> it.getKey().getName(),
                    (Map.Entry<Schema, Topic> it) -> it.getValue().name()
                )
            );

        final String supportedRecordTypes = String.join(",", new ArrayList<>(table.keySet()));

        return (key, record, recordContext) -> {
            if (record == null) {
                throw new IllegalStateException(String.format(
                    "Cannot route to topic names by record avro type for null record values (key %s)",
                    key));
            }

            final String recordType = record.getSchema().getName();

            if (!table.containsKey(recordType)) {
                throw new IllegalStateException(String.format(
                    "Unmapped record type [%s] encountered (mapped in this extractor: %s)",
                    recordType,
                    supportedRecordTypes
                ));
            }

            return table.get(recordType);
        };
    }
}
